import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type DeviceDocument = HydratedDocument<Device>

@Schema()
export class Device {
  @Prop({ type: String, required: true })
  ip: string

  @Prop({ type: String, required: true })
  deviceId: string

  @Prop({ type: String, required: true })
  deviceName: string

  @Prop({ type: String, required: true })
  userId: string

  @Prop({ type: Number })
  iat: number

  @Prop({ type: Number })
  exp: { type: number }
}

const DeviceSchema = SchemaFactory.createForClass(Device)
export const DeviceMongooseModule = MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }])
