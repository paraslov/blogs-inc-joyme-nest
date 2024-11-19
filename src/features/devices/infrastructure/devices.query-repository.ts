import { Injectable } from '@nestjs/common'
import { DevicesMappers } from './devices.mappers'
import { DataSource } from 'typeorm'
import { DeviceViewDto } from '../api/models/output/device-view.dto'

@Injectable()
export class DevicesQueryRepository {
  constructor(
    protected dataSource: DataSource,
    private devicesMappers: DevicesMappers,
  ) {}

  async getAllDevices(userId: string): Promise<DeviceViewDto[]> {
    const devices = await this.dataSource.query(
      `
      SELECT device_id, device_name, user_id, ip, iat, exp
        FROM public.devices
        WHERE user_id=$1;
    `,
      [userId],
    )

    return devices.map(this.devicesMappers.mapDtoToView)
  }
}
