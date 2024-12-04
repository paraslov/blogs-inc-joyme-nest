import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { LikesCommandService, UpdateLikeStatusDto } from '../../../likes'
import { InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { CommentDto } from '../../domain/business_entity/comment.entity'
import { CommentsRepository } from '../../infrastructure/comments.repository.service'

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

      const likesCount = commentToUpdate.likes_count + likesCountChange
      const dislikesCount = commentToUpdate.dislikes_count + dislikesCountChange

      const updatedComment: CommentDto = {
        parentId: commentToUpdate.parent_id,
        content: commentToUpdate.content,
        commentatorInfo: {
          userId: commentToUpdate.user_id,
          userLogin: commentToUpdate.user_login,
        },
        createdAt: commentToUpdate.created_at,
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
