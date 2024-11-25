import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { BlogsCommandService } from '../application/blogs.command.service'
import { CreateBlogDto } from './models/input/create-blog.dto'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { PostsQueryRepository } from '../../posts'
import { CreateBlogPostDto } from './models/input/create-blog-post.dto'
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository'
import { SaAuthGuard } from '../../auth'
import { PossibleUserId } from '../../../base/decorators'
import { FilterBlogDto } from './models/input/filter.blog.dto'
import { HttpStatusCodes } from '../../../common/models'
import { UUIDValidationPipe } from '../../../base/pipes'

@UseGuards(SaAuthGuard)
@Controller('sa/blogs')
export class BlogsSaController {
  constructor(
    private readonly blogsCommandService: BlogsCommandService,
    private readonly blogsQueryRepository: BlogsQueryRepository,

    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  findAllBlogs(@Query() query: FilterBlogDto) {
    return this.blogsQueryRepository.getAllBlogs(query)
  }

  @Get(':id/posts')
  async findAllPostsForBlog(
    @Param('id', UUIDValidationPipe) id: string,
    @Query() query: StandardInputFilters,
    @PossibleUserId() currentUserId?: string,
  ) {
    const blog = await this.blogsQueryRepository.getBlogById(id)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`)
    }

    return this.postsQueryRepository.getPostsList(query, { blogId: id, userId: currentUserId })
  }

  @HttpCode(HttpStatusCodes.CREATED_201)
  @Post()
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    const createdBlogId = await this.blogsCommandService.createBlog(createBlogDto)

    return await this.blogsQueryRepository.getBlogById(createdBlogId)
  }

  @Post(':id/posts')
  async createPostForBlog(
    @Param('id', UUIDValidationPipe) blogId: string,
    @Body() createBlogPostDto: CreateBlogPostDto,
  ) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`)
    }

    const createdPostId = await this.blogsCommandService.createPost(createBlogPostDto, blogId, blog.name)
    if (!createdPostId) {
      throw new HttpException(`Blog with ID ${blogId} not found`, HttpStatusCodes.EXPECTATION_FAILED_417)
    }

    return this.blogsQueryRepository.getPostById(createdPostId)
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Put(':id')
  async updateBlog(@Param('id', UUIDValidationPipe) id: string, @Body() updateBlogDto: CreateBlogDto) {
    const updateResult = await this.blogsCommandService.updateBlog(id, updateBlogDto)

    if (!updateResult) {
      throw new NotFoundException(`Couldn't update Blog with ID ${id}`)
    }
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Delete(':id')
  async deleteBlog(@Param('id', UUIDValidationPipe) id: string) {
    const deleteResult = await this.blogsCommandService.deleteBlog(id)

    if (!deleteResult) {
      throw new NotFoundException(`Couldn't delete Blog with ID ${id}`)
    }
  }
}
