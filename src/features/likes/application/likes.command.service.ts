import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { LikesInfoChangeDto, UpdateLikeStatusCommand } from './commands/update-like-status.command'
import { UpdateLikeStatusDto } from '../api/models/input/update-like-status.dto'
import { InterlayerDataManager } from '../../../common/manager'

@Injectable()
export class LikesCommandService {
  constructor(private readonly commandBus: CommandBus) {}

  async updateLikeStatus(
    updateLikeStatusDto: UpdateLikeStatusDto,
    parentId: string,
    userId: string,
    userLogin: string,
  ) {
    const command = new UpdateLikeStatusCommand(updateLikeStatusDto, parentId, userId, userLogin)

    return this.commandBus.execute<UpdateLikeStatusCommand, InterlayerDataManager<LikesInfoChangeDto>>(command)
  }
}
