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
import { IsBlogExistsConstraint } from './application/decorators/is-blog-exists.decorator'

/*
  @deprecated - remove after comments and likes will be refactored to blogs module
 */
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
    IsBlogExistsConstraint,
    ...postsCommandHandlers,
  ],
})
export class PostsModule {}
