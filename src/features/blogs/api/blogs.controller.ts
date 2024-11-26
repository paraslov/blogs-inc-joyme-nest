import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { PostsQueryRepository } from '../../posts'
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository'
import { PossibleUserId } from '../../../base/decorators'
import { FilterBlogDto } from './models/input/filter.blog.dto'
import { UUIDValidationPipe } from '../../../base/pipes'

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  findAllBlogs(@Query() query: FilterBlogDto) {
    return this.blogsQueryRepository.getAllBlogs(query)
  }

  @Get(':blogId/posts')
  async findAllPostsForBlog(
    @Param('blogId', UUIDValidationPipe) blogId: string,
    @Query() query: StandardInputFilters,
    @PossibleUserId() currentUserId?: string,
  ) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`)
    }

    return this.postsQueryRepository.getPostsList(query, { blogId, userId: currentUserId })
  }

  @Get(':id')
  async findBlog(@Param('id', UUIDValidationPipe) id: string) {
    const blog = await this.blogsQueryRepository.getBlogById(id)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`)
    }

    return blog
  }
}
