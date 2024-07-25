import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query } from '@nestjs/common'
import { BlogsService } from '../application/blogs.service'
import { CreateBlogDto } from './models/input/create-blog.dto'
import { UpdateBlogDto } from './models/input/update-blog.dto'
import { StandardInputFilters, StandardInputFiltersWithSearchTerm } from '../../../common/models/input/QueryInputParams'
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'
import { PostsQueryRepository } from '../../posts'
import { CreateBlogPostDto } from './models/input/create-blog-post.dto'
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository'

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,

    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  findAll(@Query() query: StandardInputFiltersWithSearchTerm) {
    return this.blogsQueryRepository.getAllBlogs(query)
  }

  @Get(':id/posts')
  async findAllPostsForBlog(@Param('id', ObjectIdValidationPipe) id: string, @Query() query: StandardInputFilters) {
    const blog = await this.blogsQueryRepository.getBlogById(id)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`)
    }

    return this.postsQueryRepository.getPostsList(query, id)
  }

  @Get(':id')
  async findOne(@Param('id', ObjectIdValidationPipe) id: string) {
    const blog = await this.blogsQueryRepository.getBlogById(id)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`)
    }

    return blog
  }

  @HttpCode(201)
  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.createBlog(createBlogDto)
  }

  @Post(':id/posts')
  async createPostForBlog(
    @Param('id', ObjectIdValidationPipe) blogId: string,
    @Body() createBlogPostDto: CreateBlogPostDto,
  ) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`)
    }

    return this.blogsService.createPost(createBlogPostDto, blogId, blog.name)
  }

  @HttpCode(204)
  @Put(':id')
  async update(@Param('id', ObjectIdValidationPipe) id: string, @Body() updateBlogDto: UpdateBlogDto) {
    const updateResult = await this.blogsService.updateBlog(id, updateBlogDto)

    if (!updateResult) {
      throw new NotFoundException(`Couldn't update Blog with ID ${id}`)
    }
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', ObjectIdValidationPipe) id: string) {
    const deleteResult = await this.blogsService.deleteBlog(id)

    if (!deleteResult) {
      throw new NotFoundException(`Couldn't delete Blog with ID ${id}`)
    }
  }
}
