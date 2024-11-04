import { Module } from '@nestjs/common'
import { DeviceMongooseModule } from './domain/mongoose/device.entity'
import { CqrsModule } from '@nestjs/cqrs'
import { DevicesController } from './api/devices.controller'
import { DevicesMappers } from './infrastructure/devices.mappers'
import { DevicesQueryRepository } from './infrastructure/devices.query-repository'
import { devicesCommandHandlers } from './application/commands'
import { DevicesRepository } from './infrastructure/devices.repository'
import { DevicesCommandService } from './application/devices.command-service'
import { DevicesService } from './application/devices.service'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [DeviceMongooseModule, CqrsModule, JwtModule],
  exports: [DeviceMongooseModule, DevicesCommandService],
  controllers: [DevicesController],
  providers: [
    DevicesMappers,
    DevicesQueryRepository,
    DevicesRepository,
    DevicesService,
    DevicesCommandService,
    ...devicesCommandHandlers,
  ],
})
export class DevicesModule {}
