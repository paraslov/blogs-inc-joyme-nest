import { Module } from '@nestjs/common'
import { PostsMongooseModule } from './domain/mongoose/posts.entity'
import { PostsController } from './api/posts.controller'
import { PostsQueryRepository } from './infrastructure/posts.query-repository'
import { PostsMappers } from './infrastructure/posts.mappers'
import { PostsService } from './application/posts.service'
import { PostsRepository } from './infrastructure/posts.repository'
import { BlogsModule } from '../blogs/blogs.module'
import { CommentsModule } from '../comments'

@Module({
  imports: [PostsMongooseModule, BlogsModule, CommentsModule],
  exports: [PostsMongooseModule, PostsQueryRepository, PostsMappers],
  controllers: [PostsController],
  providers: [PostsQueryRepository, PostsMappers, PostsService, PostsRepository],
})
export class PostsModule {}
