import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common'
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'
import { PostsQueryRepository } from '../infrastructure/posts.query-repository'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { CreatePostDto } from './models/input/create-post.dto'
import { PostsService } from '../application/posts.service'
import { BlogsQueryRepository } from '../../blogs'
import { UpdatePostDto } from './models/input/update-post.dto'
import { HttpStatusCodes } from '../../../common/models'
import { CommentsQueryRepository } from '../../comments'

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,

    private blogsQueryRepository: BlogsQueryRepository,

    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  findAll(@Query(new ValidationPipe({ transform: true })) query: StandardInputFilters) {
    return this.postsQueryRepository.getPostsList(query)
  }

  @Get(':id/comments')
  async findAllCommentsForPost(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query(new ValidationPipe({ transform: true })) query: StandardInputFilters,
  ) {
    const foundPost = await this.postsQueryRepository.getPostById(id)

    if (!foundPost) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    return this.commentsQueryRepository.getCommentsList(query, id)
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

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Put(':id')
  async updateOne(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body(new ValidationPipe({ transform: true })) updatePostDto: UpdatePostDto,
  ) {
    const blog = await this.blogsQueryRepository.getBlogById(updatePostDto.blogId)
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${updatePostDto.blogId} not found`)
    }

    const updateResult = await this.postsService.updatePost(id, updatePostDto)
    if (!updateResult) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Delete(':id')
  async deleteOne(@Param('id', ObjectIdValidationPipe) id: string) {
    const deleteResult = await this.postsService.deletePost(id)

    if (!deleteResult) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }
  }
}
