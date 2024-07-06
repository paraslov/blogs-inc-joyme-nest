import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type BlogDocument = HydratedDocument<Blog>

@Schema()
export class Blog {
  @Prop({ required: true, type: String })
  name: string

  @Prop({ required: true, type: String })
  description: string

  @Prop({ required: true, type: String })
  websiteUrl: string

  @Prop({ type: String })
  createdAt: string

  @Prop({ type: Boolean })
  isMembership: boolean
}

export const BlogSchema = SchemaFactory.createForClass(Blog)
