import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Device } from '../domain/business_entity/device'
import { DeviceEntity } from '../domain/postgres/device.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class DevicesRepository {
  constructor(@InjectRepository(DeviceEntity) private devicesOrmRepository: Repository<DeviceEntity>) {}

  getDeviceById(deviceId: string): Promise<DeviceEntity> {
    return this.devicesOrmRepository
      .createQueryBuilder('d')
      .select(['d.device_id', 'd.device_name', 'd.user_id', 'd.ip', 'd.iat', 'd.exp'])
      .where('d.device_id = :deviceId', { deviceId })
      .getOne()
  }

  async createDeviceSession(device: Device) {
    const newDevice = DeviceEntity.createDeviceModel(device)

    const createResult = await this.devicesOrmRepository.save(newDevice)
    return createResult.device_id
  }

  async deleteDeviceByDeviceId(deviceId: string) {
    const deleteResult = await this.devicesOrmRepository.delete(deviceId)

    return Boolean(deleteResult.affected)
  }

  async deleteOtherDevices(devicesIds: string[]) {
    const deleteResult = await this.devicesOrmRepository.delete(devicesIds)

    return deleteResult.affected
  }

  async updateDeviceSession(device: DeviceEntity) {
    const updateResult = await this.devicesOrmRepository.update(device.device_id, device)

    return Boolean(updateResult.affected)
  }
}
