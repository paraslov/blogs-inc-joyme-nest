import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { LikesCommandService, UpdateLikeStatusDto } from '../../../likes'
import { InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { BlogsRepository } from '../../infrastructure/blogs.repository'
import { PostViewDto } from '../../api/models/output/post.view.dto'

export class UpdatePostLikeStatusCommand {
  constructor(
    public readonly post: PostViewDto,
    public readonly updateLikeStatusDto: UpdateLikeStatusDto,
    public readonly userId: string,
    public readonly userLogin: string,
  ) {}
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusHandler implements ICommandHandler<UpdatePostLikeStatusCommand> {
  constructor(
    private readonly likesCommandService: LikesCommandService,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute(command: UpdatePostLikeStatusCommand) {
    const notice = new InterlayerDataManager()

    const { post, updateLikeStatusDto, userId, userLogin } = command

    const likesChangeData = await this.likesCommandService.updateLikeStatus(
      updateLikeStatusDto,
      post.id,
      userId,
      userLogin,
    )
    const { likesCountChange, dislikesCountChange } = likesChangeData.data

    const likesCount = (post.extendedLikesInfo?.likesCount ?? 0) + likesCountChange
    const dislikesCount = (post.extendedLikesInfo?.dislikesCount ?? 0) + dislikesCountChange

    const updateResult = await this.blogsRepository.updateLikesInfo(post.id, likesCount, dislikesCount)
    if (!updateResult) {
      notice.addError(`Post with ID ${post.id} not found`, undefined, HttpStatusCodes.NOT_FOUND_404)
    }

    return notice
  }
}
