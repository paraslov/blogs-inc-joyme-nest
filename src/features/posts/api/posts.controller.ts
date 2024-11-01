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
  UseGuards,
} from '@nestjs/common'
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'
import { PostsQueryRepository } from '../infrastructure/posts.query-repository'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { CreatePostDto } from './models/input/create-post.dto'
import { PostsService } from '../application/posts.service'
import { BlogsQueryRepository } from '../../blogs'
import { HttpStatusCodes } from '../../../common/models'
import { CommentsCommandService, CommentsQueryRepository, CreateUpdateCommentDto } from '../../comments'
import { JwtAuthGuard, SaAuthGuard } from '../../auth'
import { CurrentUserId, PossibleUserId } from '../../../base/decorators'
import { UsersQueryRepository } from '../../users'
import { UpdateLikeStatusDto } from '../../likes'
import { PostsCommandService } from '../application/posts.command.service'

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsCommandService: PostsCommandService,
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private usersQueryRepository: UsersQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsCommandService: CommentsCommandService,
  ) {}

  @Get()
  findAll(@Query() query: StandardInputFilters, @PossibleUserId() currentUserId?: string) {
    return this.postsQueryRepository.getPostsList(query, { userId: currentUserId })
  }

  @Get(':postId')
  async findById(@Param('postId', ObjectIdValidationPipe) postId: string, @PossibleUserId() currentUserId?: string) {
    const foundPost = await this.postsQueryRepository.getPostById(postId, currentUserId)

    if (!foundPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }

    return foundPost
  }

  @Get(':postId/comments')
  async findAllCommentsForPost(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Query() query: StandardInputFilters,
    @PossibleUserId() currentUserId: string | null,
  ) {
    const foundPost = await this.postsQueryRepository.getPostById(postId)

    if (!foundPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }

    return this.commentsQueryRepository.getCommentsList(query, postId, currentUserId)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async addCommentToPost(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Body() createCommentDto: CreateUpdateCommentDto,
    @CurrentUserId() currentUserId: string,
  ) {
    const post = await this.postsQueryRepository.getPostById(postId)
    const user = await this.usersQueryRepository.getUser(currentUserId)

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${currentUserId} not found`)
    }

    return this.commentsCommandService.createComment(createCommentDto, postId, user.id, user.login)
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @UseGuards(JwtAuthGuard)
  @Put(':postId/like-status')
  async updateCommentLikeStatus(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Body() updateLikeStatusDto: UpdateLikeStatusDto,
    @CurrentUserId() currentUserId: string,
  ) {
    const post = await this.postsQueryRepository.getPostById(postId)
    const user = await this.usersQueryRepository.getUser(currentUserId)

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${currentUserId} not found`)
    }

    const updateNotice = await this.postsCommandService.updatePostLikeStatus(
      post,
      updateLikeStatusDto,
      user.id,
      user.login,
    )

    if (updateNotice.hasError()) {
      throw new NotFoundException(updateNotice.extensions)
    }
  }

  @UseGuards(SaAuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const blog = await this.blogsQueryRepository.getBlogById(createPostDto.blogId)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${createPostDto.blogId} not found`)
    }

    return this.postsService.createPost(createPostDto, blog.name)
  }

  @UseGuards(SaAuthGuard)
  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Put(':id')
  async updateOne(@Param('id', ObjectIdValidationPipe) id: string, @Body() updatePostDto: CreatePostDto) {
    const blog = await this.blogsQueryRepository.getBlogById(updatePostDto.blogId)
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${updatePostDto.blogId} not found`)
    }

    const updateResult = await this.postsService.updatePost(id, updatePostDto)
    if (!updateResult) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }
  }

  @UseGuards(SaAuthGuard)
  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Delete(':id')
  async deleteOne(@Param('id', ObjectIdValidationPipe) id: string) {
    const deleteResult = await this.postsService.deletePost(id)

    if (!deleteResult) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }
  }
}
