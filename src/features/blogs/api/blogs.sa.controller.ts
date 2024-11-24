import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { BlogsCommandService } from '../application/blogs.command.service'
import { CreateBlogDto } from './models/input/create-blog.dto'
import { StandardInputFilters, StandardInputFiltersWithSearchTerm } from '../../../common/models/input/QueryInputParams'
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'
import { PostsQueryRepository } from '../../posts'
import { CreateBlogPostDto } from './models/input/create-blog-post.dto'
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository'
import { SaAuthGuard } from '../../auth'
import { PossibleUserId } from '../../../base/decorators'

@Controller('sa/blogs')
export class BlogsSaController {
  constructor(
    private readonly blogsCommandService: BlogsCommandService,
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

  @UseGuards(SaAuthGuard)
  @HttpCode(201)
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    const createdBlogId = await this.blogsCommandService.createBlog(createBlogDto)

    return await this.blogsQueryRepository.getBlogById(createdBlogId)
  }

  @UseGuards(SaAuthGuard)
  @Post(':id/posts')
  async createPostForBlog(
    @Param('id', ObjectIdValidationPipe) blogId: string,
    @Body() createBlogPostDto: CreateBlogPostDto,
  ) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`)
    }

    return this.blogsCommandService.createPost(createBlogPostDto, blogId, blog.name)
  }

  @UseGuards(SaAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async update(@Param('id', ObjectIdValidationPipe) id: string, @Body() updateBlogDto: CreateBlogDto) {
    const updateResult = await this.blogsCommandService.updateBlog(id, updateBlogDto)

    if (!updateResult) {
      throw new NotFoundException(`Couldn't update Blog with ID ${id}`)
    }
  }

  @UseGuards(SaAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', ObjectIdValidationPipe) id: string) {
    const deleteResult = await this.blogsCommandService.deleteBlog(id)

    if (!deleteResult) {
      throw new NotFoundException(`Couldn't delete Blog with ID ${id}`)
    }
  }
}
