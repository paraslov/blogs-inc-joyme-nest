import { Injectable } from '@nestjs/common'
import { BlogsMappers } from './blogs.mappers'
import { DataSource } from 'typeorm'
import { BlogSql } from '../domain/postgres/blog.sql'
import { SortDirection } from '../../../common/models/enums/sort-direction'
import { camelToSnakeUtil } from '../../../common/utils'
import { FilterBlogDto } from '../api/models/input/filter.blog.dto'
import { PaginatedOutputEntity } from '../../../common/models/output/Pagination'
import { BlogViewDto } from '../api/models/output/blog-view.dto'
import { PostFilterDto } from '../api/models/input/posts.filter.dto'
import { LikesSqlRepository } from '../../likes/infrastructure/likes.sql-repository'
import { PostViewDto } from '../api/models/output/post.view.dto'
import { PostSql } from '../domain/postgres/post.sql'

@Injectable()
export class BlogsQueryRepository {
  constructor(
    private likesRepository: LikesSqlRepository,
    private dataSource: DataSource,
    private blogsMappers: BlogsMappers,
  ) {}

  async getAllBlogs(query: FilterBlogDto): Promise<PaginatedOutputEntity<BlogViewDto[]>> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = query
    const offset = (pageNumber - 1) * pageSize
    const direction = sortDirection === SortDirection.DESC ? 'DESC' : 'ASC'
    const sortBySnakeCase = camelToSnakeUtil(sortBy)

    const blogs = await this.dataSource.query<BlogSql[]>(
      `
      SELECT id, name, description, website_url, created_at, is_membership
        FROM public.blogs
        WHERE name ILIKE '%' || $3 || '%'
        ORDER BY "${sortBySnakeCase}" ${direction}
        LIMIT $1 OFFSET $2;
    `,
      [pageSize, offset, searchNameTerm || ''],
    )
    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) AS "totalCount"
         FROM public.blogs
         WHERE name ILIKE '%' || $1 || '%';`,
      [searchNameTerm],
    )

    const totalCount = parseInt(totalCountResult?.[0]?.totalCount, 10)
    const mappedBlogs = blogs.map(this.blogsMappers.mapBlogToOutput)
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: mappedBlogs,
    }
  }

  async getBlogById(blogId: string) {
    const blogResult = await this.dataSource.query<BlogSql[]>(
      `
      SELECT id, name, description, website_url, created_at, is_membership
      FROM public.blogs
      WHERE id=$1;
    `,
      [blogId],
    )

    return this.blogsMappers.mapBlogToOutput(blogResult?.[0])
  }

  async getPostById(postId: string, currentUserId?: string): Promise<PostViewDto | null> {
    const likeStatus = await this.likesRepository.getUserLikeStatus(postId, currentUserId)
    const threeLatestLikes = await this.likesRepository.getLatestLikes(postId)
    const postResult = await this.dataSource.query<PostSql[]>(
      `
        SELECT id, title, short_description, content, blog_id, blog_name, created_at, likes_count, dislikes_count
            FROM public.posts
            WHERE id=$1;
    `,
      [postId],
    )

    return this.blogsMappers.mapPostToOutputDto(postResult?.[0], threeLatestLikes, likeStatus)
  }

  async getPostsList(
    queryFilter: PostFilterDto,
    options: { blogId?: string; userId?: string },
  ): Promise<PaginatedOutputEntity<PostViewDto[]>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryFilter
    const { blogId, userId } = options

    const offset = (pageNumber - 1) * pageSize
    const direction = sortDirection === SortDirection.DESC ? 'DESC' : 'ASC'
    const sortBySnakeCase = camelToSnakeUtil(sortBy)

    const posts = await this.dataSource.query<PostSql[]>(
      `
      SELECT id, title, short_description, content, blog_id, blog_name, created_at, likes_count, dislikes_count
        FROM public.posts
        ${blogId ? 'WHERE blog_id=$3' : ''}
        ORDER BY "${sortBySnakeCase}" ${direction}
        LIMIT $1 OFFSET $2;
    `,
      blogId ? [pageSize, offset, blogId] : [pageSize, offset],
    )
    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) AS "totalCount"
         FROM public.posts
         ${blogId ? 'WHERE blog_id=$1' : ''};`,
      blogId ? [blogId] : [],
    )

    const totalCount = parseInt(totalCountResult?.[0]?.totalCount, 10)
    const mappedPostsPromises = posts.map(async (post) => {
      const likeStatus = await this.likesRepository.getUserLikeStatus(post.id, userId)
      const threeLatestLikes = await this.likesRepository.getLatestLikes(post.id)

      return this.blogsMappers.mapPostToOutputDto(post, threeLatestLikes, likeStatus)
    })
    const mappedPosts = await Promise.all(mappedPostsPromises)
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: mappedPosts,
    }
  }
}
