import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop({ required: true, type: String })
  login: string

  @Prop({ required: true, type: String })
  email: string

  @Prop({ required: true, type: String })
  createdAt: string
}

export const UserSchema = SchemaFactory.createForClass(User)
export const UsersMongooseModule = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
