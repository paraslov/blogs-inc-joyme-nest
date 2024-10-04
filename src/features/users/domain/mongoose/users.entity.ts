import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
class UserData {
  @Prop({ required: true, type: String })
  login: string

  @Prop({ required: true, type: String })
  email: string

  @Prop({ required: true, type: String })
  passwordHash: string

  @Prop({ required: true, type: String })
  createdAt: string
}

@Schema()
class UserConfirmationData {
  @Prop({ required: true, type: String })
  confirmationCode: string

  @Prop({ required: true, type: Date })
  confirmationCodeExpirationDate: Date

  @Prop({ required: true, type: Boolean })
  isConfirmed: boolean

  @Prop({ required: false, type: String })
  passwordRecoveryCode?: string

  @Prop({ required: false, type: Date })
  passwordRecoveryCodeExpirationDate?: Date

  @Prop({ required: false, type: Boolean })
  isPasswordRecoveryConfirmed?: boolean
}

@Schema()
export class User {
  @Prop({ required: true, type: UserData })
  userData: UserData

  @Prop({ required: true, type: UserConfirmationData })
  userConfirmationData: UserConfirmationData
}

export const UserSchema = SchemaFactory.createForClass(User)
export const UsersMongooseModule = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
