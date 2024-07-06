import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type PostDocument = HydratedDocument<Post>

@Schema()
export class Post {
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

  @Prop({ type: String })
  extendedLikeInfo: null
}

export const PostSchema = SchemaFactory.createForClass(Post)
