import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository'

@Controller('comments')
export class CommentsController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  @Get(':id')
  async getOne(@Param('id', ObjectIdValidationPipe) id: string) {
    const foundComment = await this.commentsQueryRepository.getCommentById(id)

    if (!foundComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }
    return foundComment
  }
}
