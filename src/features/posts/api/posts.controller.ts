import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'
import { PostsQueryRepository } from '../infrastructure/posts.query-repository'

@Controller('posts')
export class PostsController {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  @Get()
  async findById(@Param('id', ObjectIdValidationPipe) id: string) {
    const foundPost = await this.postsQueryRepository.getPostById(id)

    if(!foundPost) {
      return new NotFoundException(`Post with ID ${id} not found`)
    }

    return foundPost
  }
}
