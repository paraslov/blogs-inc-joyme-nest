import { Injectable } from '@nestjs/common'
import { CreateCommentCommand } from './commands/create-comment.command'
import { CommandBus } from '@nestjs/cqrs'
import { CreateUpdateCommentDto } from '../api/models/input/create-update-comment.dto'
import { UpdateCommentCommand } from './commands/update-comment.command'
import { InterlayerDataManager } from '../../../common/manager'
import { UpdateCommentLikeStatusCommand } from './commands/update-like-status.command'
import { UpdateLikeStatusDto } from '../../likes'

@Injectable()
export class CommentsCommandService {
  constructor(private readonly commandBus: CommandBus) {}

  createComment(createCommentDto: CreateUpdateCommentDto, parentId: string, userId: string, userLogin: string) {
    const command = new CreateCommentCommand(createCommentDto, parentId, userId, userLogin)

    return this.commandBus.execute(command)
  }

  updateComment(updateCommentDto: CreateUpdateCommentDto, commentId: string) {
    const command = new UpdateCommentCommand(commentId, updateCommentDto)

    return this.commandBus.execute<UpdateCommentCommand, InterlayerDataManager>(command)
  }
  updateCommentLikeStatus(
    updateLikeStatusDto: UpdateLikeStatusDto,
    commentId: string,
    userId: string,
    userLogin: string,
  ) {
    const command = new UpdateCommentLikeStatusCommand(updateLikeStatusDto, commentId, userId, userLogin)

    return this.commandBus.execute<UpdateCommentLikeStatusCommand, InterlayerDataManager>(command)
  }
}
