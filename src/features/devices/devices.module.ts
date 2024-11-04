import { Module } from '@nestjs/common'
import { DeviceMongooseModule } from './domain/mongoose/device.entity'
import { CqrsModule } from '@nestjs/cqrs'
import { DevicesController } from './api/devices.controller'

@Module({
  imports: [DeviceMongooseModule, CqrsModule],
  exports: [DeviceMongooseModule],
  controllers: [DevicesController],
  providers: [],
})
export class DevicesModule {}
