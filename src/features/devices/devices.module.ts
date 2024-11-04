import { Module } from '@nestjs/common'
import { DeviceMongooseModule } from './domain/mongoose/device.entity'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [DeviceMongooseModule, CqrsModule],
  exports: [DeviceMongooseModule],
  providers: [],
})
export class DevicesModule {}
