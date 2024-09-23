import { Module } from '@nestjs/common'
import { BlogsCommandService } from './application/blogs.command.service'
import { BlogsController } from './api/blogs.controller'
import { BlogsMongooseModule } from './domain/mongoose/blogs.entity'
import { BlogsRepository } from './infrastructure/blogs.repository'
import { BlogsQueryRepository } from './infrastructure/blogs.query-repository'
import { BlogsMappers } from './infrastructure/blogs.mappers'
import { PostsMappers, PostsMongooseModule, PostsQueryRepository } from '../posts'
import { blogsCommandHandlers } from './application/commands'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [BlogsMongooseModule, PostsMongooseModule, CqrsModule],
  exports: [BlogsQueryRepository, BlogsMongooseModule, BlogsMappers, BlogsModule],
  controllers: [BlogsController],
  providers: [
    BlogsCommandService,
    BlogsRepository,
    BlogsQueryRepository,
    BlogsMappers,
    PostsQueryRepository,
    PostsMappers,
    ...blogsCommandHandlers,
  ],
})
export class BlogsModule {}
