import { Injectable } from '@nestjs/common'
import { DevicesMappers } from './devices.mappers'
import { Repository } from 'typeorm'
import { DeviceViewDto } from '../api/models/output/device-view.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DeviceEntity } from '../domain/postgres/device.entity'

@Injectable()
export class DevicesQueryRepository {
  constructor(
    @InjectRepository(DeviceEntity) private devicesOrmRepository: Repository<DeviceEntity>,
    private devicesMappers: DevicesMappers,
  ) {}

  async getAllDevices(userId: string): Promise<DeviceViewDto[]> {
    const devicesFound = await this.devicesOrmRepository
      .createQueryBuilder('d')
      .select(['d.device_id', 'd.device_name', 'd.user_id', 'd.ip', 'd.iat', 'd.exp'])
      .where('d.user_id = :userId', { userId })
      .getMany()

    return devicesFound.map(this.devicesMappers.mapDtoToView)
  }
}
