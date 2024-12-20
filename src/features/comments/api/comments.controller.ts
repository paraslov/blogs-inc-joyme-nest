import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository'
import { JwtAuthGuard } from '../../auth'
import { CreateUpdateCommentDto } from './models/input/create-update-comment.dto'
import { CurrentUserId, PossibleUserId } from '../../../base/decorators'
import { CommentsCommandService } from '../application/comments.command.service'
import { HttpStatusCodes } from '../../../common/models'
import { UsersQueryRepository } from '../../users'
import { UpdateLikeStatusDto } from '../../likes'
import { UUIDValidationPipe } from '../../../base/pipes'

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsCommandService: CommentsCommandService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get(':commentId')
  async getOne(
    @Param('commentId', UUIDValidationPipe) commentId: string,
    @PossibleUserId() currentUserId: string | null,
  ) {
    const foundComment = await this.commentsQueryRepository.getCommentById(commentId, currentUserId)

    if (!foundComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`)
    }
    return foundComment
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  async updateComment(
    @Param('commentId', UUIDValidationPipe) commentId: string,
    @CurrentUserId() currentUserId: string,
    @Body() updateCommentDto: CreateUpdateCommentDto,
  ) {
    const foundComment = await this.commentsQueryRepository.getCommentById(commentId)

    if (!foundComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`)
    }
    if (foundComment.commentatorInfo.userId !== currentUserId) {
      throw new ForbiddenException('Trying to edit not your comment')
    }

    const resultNotice = await this.commentsCommandService.updateComment(updateCommentDto, commentId)
    if (resultNotice.hasError()) {
      throw new HttpException(resultNotice.extensions, resultNotice.code)
    }
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @UseGuards(JwtAuthGuard)
  @Put(':commentId/like-status')
  async updateLikeStatus(
    @CurrentUserId() currentUserId: string,
    @Param('commentId', UUIDValidationPipe) commentId: string,
    @Body() updateLikeStatus: UpdateLikeStatusDto,
  ) {
    const foundComment = await this.commentsQueryRepository.getCommentById(commentId)
    const user = await this.usersQueryRepository.getUser(currentUserId)

    if (!user) {
      throw new NotFoundException(`User with ${currentUserId} not found`)
    }
    if (!foundComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`)
    }

    const updateNotice = await this.commentsCommandService.updateCommentLikeStatus(
      updateLikeStatus,
      commentId,
      user.id,
      user.login,
    )

    if (updateNotice.hasError()) {
      throw new NotFoundException(updateNotice.extensions)
    }
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId', UUIDValidationPipe) commentId: string,
    @CurrentUserId() currentUserId: string,
  ) {
    const foundComment = await this.commentsQueryRepository.getCommentById(commentId, currentUserId)

    if (!foundComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`)
    }
    if (foundComment.commentatorInfo.userId !== currentUserId) {
      throw new ForbiddenException('Trying to delete other user comment')
    }

    const resultNotice = await this.commentsCommandService.deleteComment(commentId)

    if (resultNotice.hasError()) {
      throw new HttpException(resultNotice.extensions, resultNotice.code)
    }

    return foundComment
  }
}
