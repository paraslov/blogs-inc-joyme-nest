import { Body, Controller, Get, HttpCode, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { CurrentUserId, PossibleUserId } from '../../../base/decorators'
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository'
import { UUIDValidationPipe } from '../../../base/pipes'
import { JwtAuthGuard } from '../../auth'
import { CommentsCommandService, CommentsQueryRepository, CreateUpdateCommentDto } from '../../comments'
import { UsersQueryRepository } from '../../users'
import { HttpStatusCodes } from '../../../common/models'
import { UpdateLikeStatusDto } from '../../likes'
import { BlogsCommandService } from '../application/blogs.command.service'

@Controller('posts')
export class PostsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsCommandService: BlogsCommandService,
    private usersQueryRepository: UsersQueryRepository,
    private commentsCommandService: CommentsCommandService,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  findAll(@Query() query: StandardInputFilters, @PossibleUserId() currentUserId?: string) {
    return this.blogsQueryRepository.getPostsList(query, { userId: currentUserId })
  }

  @Get(':postId')
  async findById(@Param('postId', UUIDValidationPipe) postId: string, @PossibleUserId() currentUserId?: string) {
    const foundPost = await this.blogsQueryRepository.getPostById(postId, currentUserId)

    if (!foundPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }

    return foundPost
  }

  @Get(':postId/comments')
  async findAllCommentsForPost(
    @Param('postId', UUIDValidationPipe) postId: string,
    @Query() query: StandardInputFilters,
    @PossibleUserId() currentUserId: string | null,
  ) {
    const foundPost = await this.blogsQueryRepository.getPostById(postId)

    if (!foundPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }

    return this.commentsQueryRepository.getCommentsList(query, postId, currentUserId)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async addCommentToPost(
    @Param('postId', UUIDValidationPipe) postId: string,
    @Body() createCommentDto: CreateUpdateCommentDto,
    @CurrentUserId() currentUserId: string,
  ) {
    const post = await this.blogsQueryRepository.getPostById(postId)
    const user = await this.usersQueryRepository.getUser(currentUserId)

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${currentUserId} not found`)
    }

    const createdCommentId = await this.commentsCommandService.createComment(
      createCommentDto,
      postId,
      user.id,
      user.login,
    )

    return this.commentsQueryRepository.getCommentById(createdCommentId, user.id)
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @UseGuards(JwtAuthGuard)
  @Put(':postId/like-status')
  async updateCommentLikeStatus(
    @Param('postId', UUIDValidationPipe) postId: string,
    @Body() updateLikeStatusDto: UpdateLikeStatusDto,
    @CurrentUserId() currentUserId: string,
  ) {
    const post = await this.blogsQueryRepository.getPostById(postId)
    const user = await this.usersQueryRepository.getUser(currentUserId)

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${currentUserId} not found`)
    }

    const updateNotice = await this.blogsCommandService.updatePostLikeStatus(
      post,
      updateLikeStatusDto,
      user.id,
      user.login,
    )

    if (updateNotice.hasError()) {
      throw new NotFoundException(updateNotice.extensions)
    }
  }
}
