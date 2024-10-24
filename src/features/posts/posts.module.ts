import { Module } from '@nestjs/common'
import { PostsMongooseModule } from './domain/mongoose/posts.entity'
import { PostsController } from './api/posts.controller'
import { PostsQueryRepository } from './infrastructure/posts.query-repository'
import { PostsMappers } from './infrastructure/posts.mappers'
import { PostsService } from './application/posts.service'
import { PostsRepository } from './infrastructure/posts.repository'
import { BlogsModule } from '../blogs/blogs.module'
import { CommentsModule } from '../comments'
import { UsersModule } from '../users/users.module'
import { LikesModule } from '../likes/likes.module'
import { CqrsModule } from '@nestjs/cqrs'
import { postsCommandHandlers } from './application/commands'
import { PostsCommandService } from './application/posts.command.service'

@Module({
  imports: [PostsMongooseModule, BlogsModule, CommentsModule, UsersModule, LikesModule, CqrsModule],
  exports: [PostsMongooseModule, PostsQueryRepository, PostsMappers],
  controllers: [PostsController],
  providers: [
    PostsQueryRepository,
    PostsMappers,
    PostsService,
    PostsCommandService,
    PostsRepository,
    ...postsCommandHandlers,
  ],
})
export class PostsModule {}
