import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { InterlayerDataManager } from '../../../common/manager'
import { UpdateLikeStatusDto } from '../../likes'
import { PostViewDto } from '../api/models/output/post.view.dto'
import { UpdatePostLikeStatusCommand } from './commands/update-post-like-status.command'

@Injectable()
export class PostsCommandService {
  constructor(private readonly commandBus: CommandBus) {}

  updatePostLikeStatus(post: PostViewDto, updateLikeStatusDto: UpdateLikeStatusDto, userId: string, userLogin: string) {
    const command = new UpdatePostLikeStatusCommand(post, updateLikeStatusDto, userId, userLogin)

    return this.commandBus.execute<UpdatePostLikeStatusCommand, InterlayerDataManager>(command)
  }
}
