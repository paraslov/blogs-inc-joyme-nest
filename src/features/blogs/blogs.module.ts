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
import { BlogEntity } from './domain/postgres/blog.entity'
import { PostEntity } from './domain/postgres/post.entity'

@Module({
  imports: [LikesModule, CqrsModule, UsersModule, CommentsModule, TypeOrmModule.forFeature([BlogEntity, PostEntity])],
  exports: [BlogsQueryRepository, BlogsMappers, BlogsModule],
  controllers: [BlogsSaController, BlogsController, PostsController],
  providers: [
    BlogsCommandService,
    BlogsRepository,
    BlogsQueryRepository,
    BlogEntity,
    PostEntity,
    BlogsMappers,
    ...blogsCommandHandlers,
  ],
})
export class BlogsModule {}
