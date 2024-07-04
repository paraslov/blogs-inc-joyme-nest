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
  UsePipes,
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
  create(
    @Body(new ValidationPipe({ transform: true })) createBlogDto: CreateBlogDto,
  ) {
    return this.blogsService.create(createBlogDto)
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: StandardInputFilters,
  ) {
    return this.blogsService.findAll(query)
  }

  @Get(':id')
  @UsePipes(new ObjectIdValidationPipe())
  async findOne(@Param('id') id: string) {
    const blog = await this.blogsService.findOne(id)

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`)
    }

    return blog
  }

  @HttpCode(204)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto)
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id)
  }
}
