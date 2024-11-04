import { Injectable } from '@nestjs/common'
import { Device } from '../domain/mongoose/device.entity'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class DevicesRepository {
  constructor(@InjectModel(Device.name) private devicesModel: Model<Device>) {}

  async getDeviceById(deviceId: string) {
    const device = await this.devicesModel.findOne({ deviceId })

    return device
  }

  async saveDeviceSession(device: Device) {
    const saveResult = await new this.devicesModel(device).save()

    return saveResult._id.toString()
  }
}
