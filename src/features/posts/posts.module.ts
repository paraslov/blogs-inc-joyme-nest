import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Post, PostSchema } from './domain/mongoose/posts.entity'

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  controllers: [],
  providers: [],
})
export class PostsModule {}
