import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { PossibleUserId } from '../../../base/decorators'
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository'
import { UUIDValidationPipe } from '../../../base/pipes'

@Controller('posts')
export class PostsController {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  @Get()
  findAll(@Query() query: StandardInputFilters, @PossibleUserId() currentUserId?: string) {
    return this.blogsQueryRepository.getPostsList(query, { userId: currentUserId })
  }

  @Get(':postId')
  async findById(@Param('postId', UUIDValidationPipe) postId: string, @PossibleUserId() currentUserId?: string) {
    const foundPost = await this.blogsQueryRepository.getPostById(postId, currentUserId)

    if (!foundPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }

    return foundPost
  }
}
