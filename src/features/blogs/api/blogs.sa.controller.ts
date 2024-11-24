import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common'
import { StandardInputFilters, StandardInputFiltersWithSearchTerm } from '../../../common/models/input/QueryInputParams'
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'
import { PostsQueryRepository } from '../../posts'
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository'
import { PossibleUserId } from '../../../base/decorators'

@Controller('sa/blogs')
export class BlogsSaController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  findAll(@Query() query: StandardInputFiltersWithSearchTerm) {
    return this.blogsQueryRepository.getAllBlogs(query)
  }

  @Get(':id/posts')
  async findAllPostsForBlog(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query() query: StandardInputFilters,
    @PossibleUserId() currentUserId?: string,
  ) {
    const blog = await this.blogsQueryRepository.getBlogById(id)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`)
    }

    return this.postsQueryRepository.getPostsList(query, { blogId: id, userId: currentUserId })
  }

  @Get(':id')
  async findOne(@Param('id', ObjectIdValidationPipe) id: string) {
    const blog = await this.blogsQueryRepository.getBlogById(id)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`)
    }

    return blog
  }
}
