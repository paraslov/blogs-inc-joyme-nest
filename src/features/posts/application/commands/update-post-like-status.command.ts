import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PostViewDto } from '../../api/models/output/post.view.dto'
import { LikesCommandService, UpdateLikeStatusDto } from '../../../likes'
import { PostsService } from '../posts.service'
import { InterlayerDataManager } from '../../../../common/manager'
import { HttpStatusCodes } from '../../../../common/models'
import { CreatePostDto } from '../../api/models/input/create-post.dto'

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
    private readonly postsService: PostsService,
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

    const updatePostData: CreatePostDto = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      likesCount: likesCount >= 0 ? likesCount : 0,
      dislikesCount: dislikesCount >= 0 ? dislikesCount : 0,
    }

    const updateResult = await this.postsService.updatePost(post.id, updatePostData)
    if (!updateResult) {
      notice.addError(`Post with ID ${post.id} not found`, undefined, HttpStatusCodes.NOT_FOUND_404)
    }

    return notice
  }
}
