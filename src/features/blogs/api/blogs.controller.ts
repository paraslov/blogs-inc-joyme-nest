import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  Query, ValidationPipe,
} from '@nestjs/common'
import { BlogsService } from '../application/blogs.service';
import { CreateBlogDto } from './models/input/create-blog.dto';
import { UpdateBlogDto } from './models/input/update-blog.dto';
import { StandardInputFilters } from '../../../common/models/input/QueryInputParams'

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @HttpCode(201)
  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll(@Query(new ValidationPipe({ transform: true })) query: StandardInputFilters) {
    console.log('@> query: ', query);
    return this.blogsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @HttpCode(204)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
