import { Module } from '@nestjs/common'
import { BlogsService } from './application/blogs.service'
import { BlogsController } from './api/blogs.controller'
import { BlogsMongooseModule } from './domain/mongoose/blogs.entity'
import { BlogsRepository } from './infrastructure/blogs.repository'
import { BlogsQueryRepository } from './infrastructure/blogs.query-repository'
import { BlogsMappers } from './infrastructure/blogs.mappers'

@Module({
  imports: [BlogsMongooseModule],
  exports: [BlogsQueryRepository, BlogsMongooseModule, BlogsMappers],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository, BlogsQueryRepository, BlogsMappers],
})
export class BlogsModule {}
