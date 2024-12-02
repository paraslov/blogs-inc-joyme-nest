import { Module } from '@nestjs/common'
import { BlogsCommandService } from './application/blogs.command.service'
import { BlogsSaController } from './api/blogs.sa.controller'
import { BlogsMongooseModule } from './domain/mongoose/blogs.entity'
import { BlogsQueryRepository } from './infrastructure/blogs.query-repository'
import { BlogsMappers } from './infrastructure/blogs.mappers'
import { blogsCommandHandlers } from './application/commands'
import { CqrsModule } from '@nestjs/cqrs'
import { LikesModule } from '../likes/likes.module'
import { BlogsSqlRepository } from './infrastructure/blogs.sql-repository'
import { BlogsController } from './api/blogs.controller'
import { PostsController } from './api/posts.controller'
import { UsersModule } from '../users/users.module'
import { CommentsModule } from '../comments'

@Module({
  imports: [BlogsMongooseModule, LikesModule, CqrsModule, UsersModule, CommentsModule],
  exports: [BlogsQueryRepository, BlogsMongooseModule, BlogsMappers, BlogsModule],
  controllers: [BlogsSaController, BlogsController, PostsController],
  providers: [BlogsCommandService, BlogsSqlRepository, BlogsQueryRepository, BlogsMappers, ...blogsCommandHandlers],
})
export class BlogsModule {}
