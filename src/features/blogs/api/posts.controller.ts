import { Body, Controller, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { CurrentUserId, PossibleUserId } from '../../../base/decorators'
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository'
import { UUIDValidationPipe } from '../../../base/pipes'
import { JwtAuthGuard } from '../../auth'
import { CommentsCommandService, CommentsQueryRepository, CreateUpdateCommentDto } from '../../comments'
import { UsersSqlQueryRepository } from '../../users'

@Controller('posts')
export class PostsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private usersQueryRepository: UsersSqlQueryRepository,
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
}
