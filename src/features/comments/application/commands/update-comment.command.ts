import { CreateUpdateCommentDto } from '../../api/models/input/create-update-comment.dto'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { CommentsSqlRepository } from '../../infrastructure/comments.sql-repository'

export class UpdateCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly updateCommentDto: CreateUpdateCommentDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler implements ICommandHandler<UpdateCommentCommand> {
  constructor(private readonly commentsRepository: CommentsSqlRepository) {}

  async execute(command: UpdateCommentCommand) {
    const notice = new InterlayerDataManager()
    const { updateCommentDto, commentId } = command

    const updateResult = await this.commentsRepository.updateCommentContent(commentId, updateCommentDto)

    if (!updateResult) {
      notice.addError('Comment update failed', null, HttpStatusCodes.EXPECTATION_FAILED_417)
    }

    return notice
  }
}
