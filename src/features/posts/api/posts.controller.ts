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
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'
import { PostsQueryRepository } from '../infrastructure/posts.query-repository'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { CreatePostDto } from './models/input/create-post.dto'
import { PostsService } from '../application/posts.service'
import { BlogsQueryRepository } from '../../blogs'
import { UpdatePostDto } from './models/input/update-post.dto'
import { HttpStatusCodes } from '../../../common/models'
import { CommentsCommandService, CommentsQueryRepository, CreateUpdateCommentDto } from '../../comments'
import { SaAuthGuard } from '../../auth/application/guards/sa-auth.guard'
import { CurrentUserId } from '../../../base/decorators/current-user-id.decorator'
import { UsersQueryRepository } from '../../users'
import { JwtAuthGuard } from '../../auth/application/guards/jwt-auth.guard'

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsCommandService: CommentsCommandService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  findAll(@Query() query: StandardInputFilters) {
    return this.postsQueryRepository.getPostsList(query)
  }

  @Get(':id/comments')
  async findAllCommentsForPost(@Param('id', ObjectIdValidationPipe) id: string, @Query() query: StandardInputFilters) {
    const foundPost = await this.postsQueryRepository.getPostById(id)

    if (!foundPost) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    return this.commentsQueryRepository.getCommentsList(query, id)
  }

  @Get(':id')
  async findById(@Param('id', ObjectIdValidationPipe) id: string) {
    const foundPost = await this.postsQueryRepository.getPostById(id)

    if (!foundPost) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    return foundPost
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async addCommentToPost(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Body() createCommentDto: CreateUpdateCommentDto,
    @CurrentUserId() currentUserId: string,
  ) {
    const post = await this.postsQueryRepository.getPostById(postId)
    const user = await this.usersQueryRepository.getUser(currentUserId)

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${currentUserId} not found`)
    }

    return this.commentsCommandService.createComment(createCommentDto, postId, user.id, user.login)
  }

  @UseGuards(SaAuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const blog = await this.blogsQueryRepository.getBlogById(createPostDto.blogId)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${createPostDto.blogId} not found`)
    }

    return this.postsService.createPost(createPostDto, blog.name)
  }

  @UseGuards(SaAuthGuard)
  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Put(':id')
  async updateOne(@Param('id', ObjectIdValidationPipe) id: string, @Body() updatePostDto: UpdatePostDto) {
    const blog = await this.blogsQueryRepository.getBlogById(updatePostDto.blogId)
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${updatePostDto.blogId} not found`)
    }

    const updateResult = await this.postsService.updatePost(id, updatePostDto)
    if (!updateResult) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }
  }

  @UseGuards(SaAuthGuard)
  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Delete(':id')
  async deleteOne(@Param('id', ObjectIdValidationPipe) id: string) {
    const deleteResult = await this.postsService.deletePost(id)

    if (!deleteResult) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }
  }
}
