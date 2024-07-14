import { Controller, Get, Param } from '@nestjs/common'
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'

@Controller('comments')
export class CommentsController {
  constructor() {}

  @Get(':id')
  getOne(@Param('id', ObjectIdValidationPipe) id: string) {
    return `comment ${id}`
  }
}
