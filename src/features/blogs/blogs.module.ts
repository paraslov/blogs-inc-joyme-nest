import { Module } from '@nestjs/common'
import { BlogsCommandService } from './application/blogs.command.service'
import { BlogsSaController } from './api/blogs.sa.controller'
import { BlogsMongooseModule } from './domain/mongoose/blogs.entity'
import { BlogsRepository } from './infrastructure/blogs.repository'
import { BlogsQueryRepository } from './infrastructure/blogs.query-repository'
import { BlogsMappers } from './infrastructure/blogs.mappers'
import { PostsMappers, PostsMongooseModule, PostsQueryRepository } from '../posts'
import { blogsCommandHandlers } from './application/commands'
import { CqrsModule } from '@nestjs/cqrs'
import { LikesModule } from '../likes/likes.module'
import { BlogsSqlRepository } from './infrastructure/blogs.sql-repository'
import { BlogsController } from './api/blogs.controller'
import { PostsController } from './api/posts.controller'

@Module({
  imports: [BlogsMongooseModule, PostsMongooseModule, LikesModule, CqrsModule],
  exports: [BlogsQueryRepository, BlogsMongooseModule, BlogsMappers, BlogsModule],
  controllers: [BlogsSaController, BlogsController, PostsController],
  providers: [
    BlogsCommandService,
    BlogsRepository,
    BlogsSqlRepository,
    BlogsQueryRepository,
    BlogsMappers,
    PostsQueryRepository,
    PostsMappers,
    ...blogsCommandHandlers,
  ],
})
export class BlogsModule {}
