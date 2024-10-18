import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository'
import { JwtAuthGuard } from '../../auth'
import { CreateUpdateCommentDto } from './models/input/create-update-comment.dto'
import { CurrentUserId } from '../../../base/decorators/current-user-id.decorator'
import { CommentsCommandService } from '../application/comments.command.service'
import { HttpStatusCodes } from '../../../common/models'

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsCommandService: CommentsCommandService,
  ) {}

  @Get(':id')
  async getOne(@Param('id', ObjectIdValidationPipe) id: string) {
    const foundComment = await this.commentsQueryRepository.getCommentById(id)

    if (!foundComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }
    return foundComment
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  async updateComment(
    @Param('commentId', ObjectIdValidationPipe) commentId: string,
    @CurrentUserId() currentUserId: string,
    updateCommentDto: CreateUpdateCommentDto,
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
}
