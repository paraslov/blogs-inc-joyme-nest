import { Body, Controller, Get, NotFoundException, Param, Post, Query, ValidationPipe } from '@nestjs/common'
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'
import { PostsQueryRepository } from '../infrastructure/posts.query-repository'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { CreatePostDto } from './models/input/create-post.dto'
import { PostsService } from '../application/posts.service'
import { BlogsQueryRepository } from '../../blogs'

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsService: PostsService,
  ) {}

  @Get()
  findAll(@Query(new ValidationPipe({ transform: true })) query: StandardInputFilters) {
    return this.postsQueryRepository.getPostsList(query)
  }

  @Get(':id')
  async findById(@Param('id', ObjectIdValidationPipe) id: string) {
    const foundPost = await this.postsQueryRepository.getPostById(id)

    if (!foundPost) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    return foundPost
  }

  @Post()
  async create(@Body(new ValidationPipe({ transform: true })) createPostDto: CreatePostDto) {
    const blog = await this.blogsQueryRepository.getBlogById(createPostDto.blogId)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${createPostDto.blogId} not found`)
    }

    return this.postsService.createPost(createPostDto, blog.name)
  }
}
