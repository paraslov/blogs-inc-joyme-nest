import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type PostDocument = HydratedDocument<PostEntity>

@Schema()
export class PostEntity {
  @Prop({ required: true, type: String })
  title: string

  @Prop({ required: true, type: String })
  shortDescription: string

  @Prop({ required: true, type: String })
  content: string

  @Prop({ required: true, type: String })
  blogId: string

  @Prop({ required: true, type: String })
  blogName: string

  @Prop({ type: String })
  createdAt: string

  @Prop({ type: Number })
  likesCount?: number

  @Prop({ type: Number })
  dislikesCount?: number
}

export const PostSchema = SchemaFactory.createForClass(PostEntity)

export const PostsMongooseModule = MongooseModule.forFeature([{ name: PostEntity.name, schema: PostSchema }])
