import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { LikeStatus } from '../../api/models/enums/like-status'
import { HydratedDocument } from 'mongoose'

export type LikeDocument = HydratedDocument<Like>

@Schema()
export class Like {
  @Prop({ required: true, type: String })
  userId: string

  @Prop({ required: true, type: String })
  userLogin: string

  @Prop({ required: true, type: LikeStatus })
  status: LikeStatus

  @Prop({ required: true, type: String })
  parentId: string

  @Prop({ required: true, type: Date })
  createdAt: Date
}

export const LikeSchema = SchemaFactory.createForClass(Like)
export const LikesMongooseModule = MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }])
