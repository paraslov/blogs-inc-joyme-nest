import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Blog } from '../domain/business_entities/blogs.entity'
import { CreateBlogDto } from '../api/models/input/create-blog.dto'
import { UpdatePostDto } from '../api/models/input/update-post.dto'
import { PostEntity } from '../domain/business_entities/posts.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { BlogDbModel } from '../domain/postgres/blog-db-model'
import { PostDbModel } from '../domain/postgres/post-db-model'

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(BlogDbModel) private blogsOrmRepository: Repository<BlogDbModel>,
    @InjectRepository(PostDbModel) private postsOrmRepository: Repository<PostDbModel>,
  ) {}

  async createBlog(newBlog: Blog) {
    const createBlogDto = BlogDbModel.createBlogModel(newBlog)

    const createBlogRes = await this.blogsOrmRepository.save(createBlogDto)
    return createBlogRes?.id ?? null
  }

  async createPostForBlog(newPost: PostEntity) {
    const createPostDto = PostDbModel.createPostModel(newPost)

    const createPostResult = await this.postsOrmRepository.save(createPostDto)
    return createPostResult?.id ?? null
  }

  async updateBlog(blogId: string, updateBlog: CreateBlogDto) {
    const { name, description, websiteUrl } = updateBlog
    const updateBlogDto = new BlogDbModel()
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
    const updatePostDto = new PostDbModel()
    updatePostDto.title = title
    updatePostDto.short_description = shortDescription
    updatePostDto.content = content

    const updateResult = await this.postsOrmRepository.update(postId, updatePostDto)
    return Boolean(updateResult?.affected)
  }

  async updateLikesInfo(postId: string, likesCount: number, dislikesCount: number) {
    const updatePostDto = new PostDbModel()
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
