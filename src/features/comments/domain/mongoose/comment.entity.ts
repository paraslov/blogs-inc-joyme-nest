import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type CommentDocument = HydratedDocument<CommentDto>

@Schema()
export class CommentatorInfoSchema {
  @Prop({ required: true, type: String })
  userId: string

  @Prop({ required: true, type: String })
  userLogin: string
}

@Schema()
export class CommentDto {
  @Prop({ required: true, type: String })
  parentId: string

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

export const CommentSchema = SchemaFactory.createForClass(CommentDto)
export const CommentsMongooseModule = MongooseModule.forFeature([{ name: CommentDto.name, schema: CommentSchema }])
