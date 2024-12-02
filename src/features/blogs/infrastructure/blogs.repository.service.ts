import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Blog } from '../domain/mongoose/blogs.entity'
import { CreateBlogDto } from '../api/models/input/create-blog.dto'
import { UpdatePostDto } from '../api/models/input/update-post.dto'
import { CreatePostDto } from '../api/models/input/create-post.dto'
import { PostEntity } from '../domain/mongoose/posts.entity'

@Injectable()
export class BlogsRepository {
  constructor(private dataSource: DataSource) {}
  async createBlog(newBlog: Blog) {
    const { name, description, websiteUrl, createdAt, isMembership } = newBlog
    const createBlogResult = await this.dataSource.query(
      `
      INSERT INTO public.blogs(
        name, description, website_url, created_at, is_membership)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `,
      [name, description, websiteUrl, createdAt, isMembership],
    )

    return createBlogResult?.[0]?.id ?? null
  }

  async createPostForBlog(newPost: PostEntity) {
    const { title, shortDescription, content, blogId, blogName, createdAt, likesCount, dislikesCount } = newPost
    const createPostResult = await this.dataSource.query(
      `
      INSERT INTO public.posts(
        title, short_description, content, blog_id, blog_name, created_at, likes_count, dislikes_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id;
    `,
      [title, shortDescription, content, blogId, blogName, createdAt, likesCount, dislikesCount],
    )

    return createPostResult?.[0]?.id ?? null
  }

  async updateBlog(id: string, updateBlog: CreateBlogDto) {
    const { name, description, websiteUrl } = updateBlog
    const updateResult = await this.dataSource.query(
      `
      UPDATE public.blogs
        SET name=$2, description=$3, website_url=$4
        WHERE id=$1;
    `,
      [id, name, description, websiteUrl],
    )

    return Boolean(updateResult?.[1])
  }

  async deleteBlog(blogId: string) {
    const deleteResult = await this.dataSource.query(
      `
        DELETE FROM public.blogs
            WHERE id=$1;    
    `,
      [blogId],
    )

    return Boolean(deleteResult?.[1])
  }

  async updatePostForBlog(postId: string, updateDto: UpdatePostDto) {
    const { title, shortDescription, content } = updateDto
    const updateResult = await this.dataSource.query(
      `
        UPDATE public.posts
            SET title=$2, short_description=$3, content=$4
            WHERE id=$1;
    `,
      [postId, title, shortDescription, content],
    )

    return Boolean(updateResult?.[1])
  }

  async updateLikesInfo(postId: string, updateDto: Required<CreatePostDto>) {
    const { title, shortDescription, content, likesCount, dislikesCount } = updateDto
    const updateResult = await this.dataSource.query(
      `
        UPDATE public.posts
            SET title=$2, short_description=$3, content=$4, likes_count=$5, dislikes_count=$6
            WHERE id=$1;
    `,
      [postId, title, shortDescription, content, likesCount, dislikesCount],
    )

    return Boolean(updateResult?.[1])
  }

  async deletePostForBlog(postId: string) {
    const deleteResult = await this.dataSource.query(
      `
      DELETE FROM public.posts
        WHERE id=$1;
    `,
      [postId],
    )

    return Boolean(deleteResult?.[1])
  }
}
