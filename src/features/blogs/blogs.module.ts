import { Module } from '@nestjs/common'
import { BlogsCommandService } from './application/blogs.command.service'
import { BlogsSaController } from './api/blogs.sa.controller'
import { BlogsQueryRepository } from './infrastructure/blogs.query-repository'
import { BlogsMappers } from './infrastructure/blogs.mappers'
import { blogsCommandHandlers } from './application/commands'
import { CqrsModule } from '@nestjs/cqrs'
import { LikesModule } from '../likes/likes.module'
import { BlogsRepository } from './infrastructure/blogs.repository'
import { BlogsController } from './api/blogs.controller'
import { PostsController } from './api/posts.controller'
import { UsersModule } from '../users/users.module'
import { CommentsModule } from '../comments'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlogDbModel } from './domain/postgres/blog-db-model.entity'
import { PostDbModel } from './domain/postgres/post-db-model.entity'

@Module({
  imports: [LikesModule, CqrsModule, UsersModule, CommentsModule, TypeOrmModule.forFeature([BlogDbModel, PostDbModel])],
  exports: [BlogsQueryRepository, BlogsMappers, BlogsModule],
  controllers: [BlogsSaController, BlogsController, PostsController],
  providers: [
    BlogsCommandService,
    BlogsRepository,
    BlogsQueryRepository,
    BlogDbModel,
    PostDbModel,
    BlogsMappers,
    ...blogsCommandHandlers,
  ],
})
export class BlogsModule {}
