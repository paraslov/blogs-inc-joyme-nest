import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { DeviceEntity } from '../domain/business_entity/device.entity'
import { Devices } from '../domain/postgres/device-db-model'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class DevicesRepository {
  constructor(@InjectRepository(Devices) private devicesOrmRepository: Repository<Devices>) {}

  getDeviceById(deviceId: string): Promise<Devices> {
    return this.devicesOrmRepository
      .createQueryBuilder('d')
      .select(['d.device_id', 'd.device_name', 'd.user_id', 'd.ip', 'd.iat', 'd.exp'])
      .where('d.device_id = :deviceId', { deviceId })
      .getOne()
  }

  async createDeviceSession(device: DeviceEntity) {
    const newDevice = new Devices()
    newDevice.device_id = device.deviceId
    newDevice.device_name = device.deviceName
    newDevice.user_id = device.userId
    newDevice.ip = device.ip
    newDevice.iat = device.iat
    newDevice.exp = device.exp

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

  async updateDeviceSession(device: Devices) {
    const updateResult = await this.devicesOrmRepository.update(device.device_id, device)

    return Boolean(updateResult.affected)
  }
}
