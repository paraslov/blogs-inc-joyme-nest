import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { LikesCommandService, UpdateLikeStatusDto } from '../../../likes'
import { InterlayerDataManager } from '../../../../common/manager'
import { CommentsRepository } from '../../infrastructure/comments.repository'
import { HttpStatusCodes } from '../../../../common/models'
import { CommentDto } from '../../domain/mongoose/comment.entity'

export class UpdateCommentLikeStatusCommand {
  constructor(
    public readonly updateLikeStatusDto: UpdateLikeStatusDto,
    public readonly commentId: string,
    public readonly userId: string,
    public readonly userLogin: string,
  ) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusHandler implements ICommandHandler<UpdateCommentLikeStatusCommand> {
  constructor(
    private likesCommandService: LikesCommandService,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(command: UpdateCommentLikeStatusCommand) {
    const notice = new InterlayerDataManager()
    const { commentId } = command

    try {
      const { likesCountChange, dislikesCountChange } = await this.getLikesChangeInfo(command)

      const commentToUpdate = await this.commentsRepository.getCommentDBModelById(commentId)

      const likesCount = commentToUpdate.likesCount + likesCountChange
      const dislikesCount = commentToUpdate.dislikesCount + dislikesCountChange

      const updatedComment: CommentDto = {
        parentId: commentToUpdate.parentId,
        content: commentToUpdate.content,
        commentatorInfo: commentToUpdate.commentatorInfo,
        createdAt: commentToUpdate.createdAt,
        likesCount: likesCount >= 0 ? likesCount : 0,
        dislikesCount: dislikesCount >= 0 ? dislikesCount : 0,
      }

      await this.commentsRepository.updateComment(commentId, updatedComment)
    } catch (err) {
      notice.addError('Something goes wrong', null, HttpStatusCodes.NOT_FOUND_404)
    }

    return notice
  }
  async getLikesChangeInfo(command: UpdateCommentLikeStatusCommand) {
    const { updateLikeStatusDto, userId, userLogin, commentId } = command

    const likeUpdateResult = await this.likesCommandService.updateLikeStatus(
      updateLikeStatusDto,
      commentId,
      userId,
      userLogin,
    )

    return likeUpdateResult.data
  }
}
