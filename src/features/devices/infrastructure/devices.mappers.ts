import { Injectable } from '@nestjs/common'
import { Device } from '../domain/mongoose/device.entity'
import { DeviceViewDto } from '../api/models/output/device-view.dto'

@Injectable()
export class DevicesMappers {
  mapDtoToView(device: Device) {
    const deviceView = new DeviceViewDto()

    deviceView.deviceId = device.deviceId
    deviceView.ip = device.ip
    deviceView.title = device.deviceName
    deviceView.lastActiveDate = new Date(device.iat).toISOString()

    return deviceView
  }
}
