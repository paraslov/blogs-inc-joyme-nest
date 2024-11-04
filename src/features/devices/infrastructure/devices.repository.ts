import { Injectable } from '@nestjs/common'
import { Device } from '../domain/mongoose/device.entity'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class DevicesRepository {
  constructor(@InjectModel(Device.name) private devicesModel: Model<Device>,) {
  }
  async getDeviceByRefreshToken(refreshToken: string) {
    const device = await this.devicesModel.findOne({ refreshToken })
  }
}
