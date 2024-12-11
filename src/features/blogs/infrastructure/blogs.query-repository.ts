import { Injectable } from '@nestjs/common'
import { BlogsMappers } from './blogs.mappers'
import { DataSource, Repository } from 'typeorm'
import { BlogDbModel } from '../domain/postgres/blog-db-model'
import { SortDirection } from '../../../common/models/enums/sort-direction'
import { camelToSnakeUtil } from '../../../common/utils'
import { FilterBlogDto } from '../api/models/input/filter.blog.dto'
import { PaginatedOutputEntity } from '../../../common/models/output/Pagination'
import { BlogViewDto } from '../api/models/output/blog-view.dto'
import { PostFilterDto } from '../api/models/input/posts.filter.dto'
import { LikesRepository } from '../../likes/infrastructure/likes.repository'
import { PostViewDto } from '../api/models/output/post.view.dto'
import { PostDbModel } from '../domain/postgres/post-db-model'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(BlogDbModel) private blogsOrmRepository: Repository<BlogDbModel>,
    @InjectRepository(PostDbModel) private postsOrmRepository: Repository<PostDbModel>,
    private likesRepository: LikesRepository,
    private blogsMappers: BlogsMappers,
  ) {}

  async getAllBlogs(query: FilterBlogDto): Promise<PaginatedOutputEntity<BlogViewDto[]>> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = query
    const offset = (pageNumber - 1) * pageSize
    const direction = sortDirection === SortDirection.DESC ? 'DESC' : 'ASC'
    const sortBySnakeCase = camelToSnakeUtil(sortBy)

    const [blogs, totalCount] = await this.blogsOrmRepository
      .createQueryBuilder('b')
      .select(['b.id', 'b.name', 'b.description', 'b.website_url', 'b.created_at', 'b.is_membership'])
      .where('b.name ILIKE :searchNameTerm', { searchNameTerm: `%${searchNameTerm || ''}%` })
      .orderBy(`b.${sortBySnakeCase}`, direction)
      .skip(offset)
      .limit(pageSize)
      .getManyAndCount()

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
    const foundBlog = await this.blogsOrmRepository
      .createQueryBuilder('b')
      .select(['b.id', 'b.name', 'b.description', 'b.website_url', 'b.created_at', 'b.is_membership'])
      .where('b.id = :blogId', { blogId })
      .getOne()

    return this.blogsMappers.mapBlogToOutput(foundBlog)
  }

  async getPostById(postId: string, currentUserId?: string): Promise<PostViewDto | null> {
    const likeStatus = await this.likesRepository.getUserLikeStatus(postId, currentUserId)
    const threeLatestLikes = await this.likesRepository.getLatestLikes(postId)

    const foundPost = await this.postsOrmRepository
      .createQueryBuilder('p')
      .select([
        'p.id',
        'p.title',
        'p.short_description',
        'p.content',
        'p.blog_id',
        'p.blog_name',
        'p.created_at',
        'p.likes_count',
        'p.dislikes_count',
      ])
      .where('id = :postId', { postId })
      .getOne()

    return this.blogsMappers.mapPostToOutputDto(foundPost, threeLatestLikes, likeStatus)
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

    const [posts, totalCount] = await this.postsOrmRepository
      .createQueryBuilder('p')
      .select([
        'p.id',
        'p.title',
        'p.short_description',
        'p.content',
        'p.blog_id',
        'p.blog_name',
        'p.created_at',
        'p.likes_count',
        'p.dislikes_count',
      ])
      .where(blogId ? 'blog_id = :blogId' : '', blogId ? { blogId } : {})
      .orderBy(`p.${sortBySnakeCase}`, direction)
      .skip(offset)
      .limit(pageSize)
      .getManyAndCount()

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
