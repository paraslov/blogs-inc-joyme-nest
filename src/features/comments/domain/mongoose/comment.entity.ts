import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type CommentDocument = HydratedDocument<Comment>

@Schema()
export class CommentatorInfoSchema {
  @Prop({ required: true, type: String })
  userId: string

  @Prop({ required: true, type: String })
  userLogin: string
}

@Schema()
export class Comment {
  @Prop({ required: true, type: String })
  content: string

  @Prop({ required: true, type: String })
  createdAt: string

  @Prop({ required: true, type: CommentatorInfoSchema })
  commentatorInfo: CommentatorInfoSchema

  @Prop({ type: Number })
  likesCount: number

  @Prop({ type: Number })
  dislikesCount: number
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
export const CommentsMongooseModule = MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])
