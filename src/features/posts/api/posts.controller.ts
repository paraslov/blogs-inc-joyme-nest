import { Controller, Get, NotFoundException, Param, Query, ValidationPipe } from '@nestjs/common'
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'
import { PostsQueryRepository } from '../infrastructure/posts.query-repository'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'

@Controller('posts')
export class PostsController {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  @Get()
  findAll(@Query(new ValidationPipe({ transform: true })) query: StandardInputFilters) {
    return this.postsQueryRepository.getPostsList(query)
  }

  @Get(':id')
  async findById(@Param('id', ObjectIdValidationPipe) id: string) {
    const foundPost = await this.postsQueryRepository.getPostById(id)

    if (!foundPost) {
      return new NotFoundException(`Post with ID ${id} not found`)
    }

    return foundPost
  }
}
