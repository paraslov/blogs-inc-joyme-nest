import { Prop, Schema } from '@nestjs/mongoose'

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
