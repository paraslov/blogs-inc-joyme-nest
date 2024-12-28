import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Blog } from '../domain/business_entities/blogs'
import { CreateBlogDto } from '../api/models/input/create-blog.dto'
import { UpdatePostDto } from '../api/models/input/update-post.dto'
import { Post } from '../domain/business_entities/posts'
import { InjectRepository } from '@nestjs/typeorm'
import { BlogEntity } from '../domain/postgres/blog.entity'
import { PostEntity } from '../domain/postgres/post.entity'

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(BlogEntity) private blogsOrmRepository: Repository<BlogEntity>,
    @InjectRepository(PostEntity) private postsOrmRepository: Repository<PostEntity>,
  ) {}

  async createBlog(newBlog: Blog) {
    const createBlogDto = BlogEntity.createBlogModel(newBlog)

    const createBlogRes = await this.blogsOrmRepository.save(createBlogDto)
    return createBlogRes?.id ?? null
  }

  async createPostForBlog(newPost: Post) {
    const createPostDto = PostEntity.createPostModel(newPost)

    const createPostResult = await this.postsOrmRepository.save(createPostDto)
    return createPostResult?.id ?? null
  }

  async updateBlog(blogId: string, updateBlog: CreateBlogDto) {
    const { name, description, websiteUrl } = updateBlog
    const updateBlogDto = new BlogEntity()
    updateBlogDto.name = name
    updateBlogDto.description = description
    updateBlogDto.website_url = websiteUrl

    const updateResult = await this.blogsOrmRepository.update(blogId, updateBlogDto)
    return Boolean(updateResult?.affected)
  }

  async deleteBlog(blogId: string) {
    const deleteResult = await this.blogsOrmRepository.delete(blogId)

    return Boolean(deleteResult?.affected)
  }

  async updatePostForBlog(postId: string, updateDto: UpdatePostDto) {
    const { title, shortDescription, content } = updateDto
    const updatePostDto = new PostEntity()
    updatePostDto.title = title
    updatePostDto.short_description = shortDescription
    updatePostDto.content = content

    const updateResult = await this.postsOrmRepository.update(postId, updatePostDto)
    return Boolean(updateResult?.affected)
  }

  async updateLikesInfo(postId: string, likesCount: number, dislikesCount: number) {
    const updatePostDto = new PostEntity()
    updatePostDto.likes_count = likesCount
    updatePostDto.dislikes_count = dislikesCount

    const updateResult = await this.postsOrmRepository.update(postId, updatePostDto)
    return Boolean(updateResult?.affected)
  }

  async deletePostForBlog(postId: string) {
    const deleteResult = await this.postsOrmRepository.delete(postId)

    return Boolean(deleteResult?.affected)
  }
}
