import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CommentsRepository } from '../../infrastructure/comments.repository'
import { InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'

export class DeleteCommentCommand {
  constructor(public readonly commentId: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: DeleteCommentCommand) {
    const notice = new InterlayerDataManager()
    const { commentId } = command

    const result = await this.commentsRepository.deleteComment(commentId)
    !result && notice.addError('Delete was unsuccessful', null, HttpStatusCodes.NOT_FOUND_404)

    return notice
  }
}
