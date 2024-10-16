import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateLikeStatusDto } from '../../api/models/input/update-like-status.dto'
import { LikesRepository } from '../../infrastructure/likes.repository'
import { LikeStatus } from '../../api/models/enums/like-status'
import { Like } from '../../domain/mongoose/likes.entity'
import { InterlayerDataManager } from '../../../../common/manager'

class LikesInfoChangeDto {
  likesCountChange: number
  dislikesCountChange: number
}

export class UpdateLikeStatusCommand {
  constructor(
    public readonly updateLikeStatusDto: UpdateLikeStatusDto,
    public readonly parentId: string,
    public readonly userId: string,
    public readonly userLogin: string,
  ) {}
}

@CommandHandler(UpdateLikeStatusCommand)
export class UpdateLikeStatusHandler implements ICommandHandler<UpdateLikeStatusCommand> {
  constructor(private readonly likesRepository: LikesRepository) {}

  async execute(command: UpdateLikeStatusCommand) {
    const notice = new InterlayerDataManager<LikesInfoChangeDto>()
    const { updateLikeStatusDto, userLogin, userId, parentId } = command
    const newLikeStatus = updateLikeStatusDto.likeStatus

    const currentLikeStatus = await this.likesRepository.getLikeStatus(userId, parentId)
    let likesCountChange: number
    let dislikesCountChange: number

    if (currentLikeStatus) {
      const updatedLikeStatusDto: Like = {
        userId: currentLikeStatus.userId,
        userLogin: currentLikeStatus.userLogin,
        parentId: currentLikeStatus.parentId,
        status: newLikeStatus,
        createdAt: currentLikeStatus.status === newLikeStatus ? currentLikeStatus.createdAt : new Date(),
      }
      await this.likesRepository.updateLikeStatus(updatedLikeStatusDto, parentId)

      const { dislikesCount, likesCount } = this.calculateChanges(currentLikeStatus.status, newLikeStatus)
      likesCountChange = likesCount
      dislikesCountChange = dislikesCount
    } else {
      const createLikeStatusDto: Like = {
        userId,
        userLogin,
        parentId,
        status: newLikeStatus,
        createdAt: new Date(),
      }

      await this.likesRepository.saveLikeStatus(createLikeStatusDto)

      likesCountChange = newLikeStatus === LikeStatus.LIKE ? 1 : 0
      dislikesCountChange = newLikeStatus === LikeStatus.DISLIKE ? 1 : 0
    }

    return notice.addData({ likesCountChange, dislikesCountChange })
  }

  calculateChanges(currentStatus: LikeStatus, changedStatus: LikeStatus) {
    let likesCount = 0
    let dislikesCount = 0

    if (currentStatus === LikeStatus.LIKE && changedStatus === LikeStatus.DISLIKE) {
      likesCount = -1
      dislikesCount = 1
    }

    if (currentStatus === LikeStatus.LIKE && changedStatus === LikeStatus.NONE) {
      likesCount = -1
      dislikesCount = 0
    }

    if (currentStatus === LikeStatus.DISLIKE && changedStatus === LikeStatus.NONE) {
      likesCount = 0
      dislikesCount = -1
    }

    if (currentStatus === LikeStatus.DISLIKE && changedStatus === LikeStatus.LIKE) {
      likesCount = 1
      dislikesCount = -1
    }

    if (currentStatus === LikeStatus.NONE && changedStatus === LikeStatus.LIKE) {
      likesCount = 1
      dislikesCount = 0
    }

    if (currentStatus === LikeStatus.NONE && changedStatus === LikeStatus.DISLIKE) {
      likesCount = 0
      dislikesCount = -1
    }

    return { likesCount, dislikesCount }
  }
}
