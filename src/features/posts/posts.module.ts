import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Post, PostSchema } from './domain/mongoose/posts.entity'
import { PostsController } from './api/posts.controller'
import { PostsQueryRepository } from './infrastructure/posts.query-repository'
import { PostsMappers } from './infrastructure/posts.mappers'

@Module({
  imports: [ MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]) ],
  controllers: [ PostsController ],
  providers: [ PostsQueryRepository, PostsMappers ],
})
export class PostsModule {}
