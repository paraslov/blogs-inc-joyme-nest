import { Injectable } from '@nestjs/common'
import { Device } from '../domain/mongoose/device.entity'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DevicesMappers } from './devices.mappers'

@Injectable()
export class DevicesQueryRepository {
  constructor(
    @InjectModel(Device.name) private devicesModel: Model<Device>,
    private devicesMappers: DevicesMappers,
  ) {}

  async getAllDevices(userId: string) {
    const devices = await this.devicesModel.find({ userId })

    return devices.map(this.devicesMappers.mapDtoToView)
  }
}
