import { CreateUpdateCommentDto } from '../../api/models/input/create-update-comment.dto'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CommentDto } from '../../domain/business_entity/comment.entity'
import { CommentsRepository } from '../../infrastructure/comments.repository'

export class CreateCommentCommand {
  constructor(
    public readonly createCommentDto: CreateUpdateCommentDto,
    public readonly parentId: string,
    public readonly userId: string,
    public readonly userLogin: string,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler implements ICommandHandler<CreateCommentCommand> {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  execute(command: CreateCommentCommand) {
    const { createCommentDto, parentId, userLogin, userId } = command

    const newComment: CommentDto = {
      parentId,
      content: createCommentDto.content,
      commentatorInfo: {
        userId,
        userLogin,
      },
      createdAt: new Date().toISOString(),
      likesCount: 0,
      dislikesCount: 0,
    }

    return this.commentsRepository.createComment(newComment)
  }
}
