import { Injectable } from '@nestjs/common'
import { DeviceViewDto } from '../api/models/output/device-view.dto'
import { Devices } from '../domain/postgres/device-db-model'

@Injectable()
export class DevicesMappers {
  mapDtoToView(device: Devices) {
    const deviceView = new DeviceViewDto()

    deviceView.deviceId = device.device_id
    deviceView.ip = device.ip
    deviceView.title = device.device_name
    deviceView.lastActiveDate = new Date(device.iat * 1000).toISOString()

    return deviceView
  }
}
