import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Post, PostSchema } from './domain/mongoose/posts.entity'
import { PostsController } from './api/posts.controller'
import { PostsQueryRepository } from './infrastructure/posts.query-repository'
import { PostsMappers } from './infrastructure/posts.mappers'
import { PostsService } from './application/posts.service'
import { PostsRepository } from './infrastructure/posts.repository'
import { BlogsMappers, BlogsMongooseModule, BlogsQueryRepository } from '../blogs'


@Module({
  imports: [ MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), BlogsMongooseModule ],
  controllers: [ PostsController ],
  providers: [ PostsQueryRepository, PostsMappers, PostsService, PostsRepository, BlogsQueryRepository, BlogsMappers ],
})
export class PostsModule {}
