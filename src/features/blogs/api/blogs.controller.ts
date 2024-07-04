import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  Query,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common'
import { BlogsService } from '../application/blogs.service'
import { CreateBlogDto } from './models/input/create-blog.dto'
import { UpdateBlogDto } from './models/input/update-blog.dto'
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @HttpCode(201)
  @Post()
  create(@Body(new ValidationPipe({ transform: true })) createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto)
  }

  @Get()
  findAll(@Query(new ValidationPipe({ transform: true })) query: StandardInputFilters) {
    return this.blogsService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id', ObjectIdValidationPipe) id: string) {
    const blog = await this.blogsService.findOne(id)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`)
    }

    return blog
  }

  @HttpCode(204)
  @Put(':id')
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body(new ValidationPipe({ transform: true })) updateBlogDto: UpdateBlogDto,
  ) {
    const updateResult = await this.blogsService.update(id, updateBlogDto)

    if (!updateResult) {
      throw new NotFoundException(`Couldn't update Blog with ID ${id}`)
    }
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', ObjectIdValidationPipe) id: string) {
    const deleteResult = await this.blogsService.remove(id)

    if (!deleteResult) {
      throw new NotFoundException(`Couldn't delete Blog with ID ${id}`)
    }
  }
}
