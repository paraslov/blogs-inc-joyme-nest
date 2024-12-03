import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DevicesController } from './api/devices.controller'
import { DevicesMappers } from './infrastructure/devices.mappers'
import { DevicesQueryRepository } from './infrastructure/devices.query-repository'
import { devicesCommandHandlers } from './application/commands'
import { DevicesCommandService } from './application/devices.command-service'
import { JwtModule } from '@nestjs/jwt'
import { JwtOperationsService } from '../../common/services'
import { DevicesSqlRepository } from './infrastructure/devices.sql-repository'

@Module({
  imports: [CqrsModule, JwtModule],
  exports: [DevicesCommandService, DevicesSqlRepository],
  controllers: [DevicesController],
  providers: [
    DevicesMappers,
    DevicesQueryRepository,
    DevicesSqlRepository,
    DevicesCommandService,
    JwtOperationsService,
    ...devicesCommandHandlers,
  ],
})
export class DevicesModule {}
