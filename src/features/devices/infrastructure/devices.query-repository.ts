import { Injectable } from '@nestjs/common'
import { DevicesMappers } from './devices.mappers'
import { Repository } from 'typeorm'
import { DeviceViewDto } from '../api/models/output/device-view.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Devices } from '../domain/postgres/device-db-model'

@Injectable()
export class DevicesQueryRepository {
  constructor(
    @InjectRepository(Devices) private devicesOrmRepository: Repository<Devices>,
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
