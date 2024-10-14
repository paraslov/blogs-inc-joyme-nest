import { Injectable } from '@nestjs/common'
import { CreateCommentCommand } from './commands/create-comment.command'
import { CommandBus } from '@nestjs/cqrs'
import { CreateUpdateCommentDto } from '../api/models/input/create-update-comment.dto'

@Injectable()
export class CommentsCommandService {
  constructor(private readonly commandBus: CommandBus) {}

  createComment(createCommentDto: CreateUpdateCommentDto, parentId: string, userId: string, userLogin: string) {
    const command = new CreateCommentCommand(createCommentDto, parentId, userId, userLogin)

    return this.commandBus.execute(command)
  }
}
