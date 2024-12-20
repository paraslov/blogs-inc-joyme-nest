import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Device } from '../domain/business_entity/device.entity'
import { DevicesDbModel } from '../domain/postgres/device-db-model'

@Injectable()
export class DevicesRepository {
  constructor(protected dataSource: DataSource) {}
  async getDeviceById(deviceId: string): Promise<DevicesDbModel> {
    const result = await this.dataSource.query(
      `
      SELECT device_id, device_name, user_id, ip, iat, exp
        FROM public.devices
        WHERE device_id=$1;
    `,
      [deviceId],
    )

    return result?.[0]
  }

  async createDeviceSession(device: Device) {
    const createResult = await this.dataSource.query(
      `
      INSERT INTO public.devices(
        device_id, device_name, user_id, ip, iat, exp)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING device_id;
    `,
      [device.deviceId, device.deviceName, device.userId, device.ip, device.iat, device.exp],
    )

    return createResult?.[0]
  }

  async deleteDeviceByDeviceId(deviceId: string) {
    const deleteResult = await this.dataSource.query(
      `
      DELETE FROM public.devices
        WHERE device_id=$1;
    `,
      [deviceId],
    )

    return Boolean(deleteResult?.[1])
  }

  async deleteOtherDevices(devicesIds: string[]) {
    const deleteResult = await this.dataSource.query(
      `
        DELETE FROM public.devices
          WHERE device_id = ANY($1);
    `,
      [devicesIds],
    )

    return deleteResult?.[1]
  }

  async updateDeviceSession(device: DevicesDbModel) {
    const updateResult = await this.dataSource.query(
      `
      UPDATE public.devices
        SET device_name=$2, user_id=$3, ip=$4, iat=$5, exp=$6
        WHERE device_id=$1;
    `,
      [device.device_id, device.device_name, device.user_id, device.ip, device.iat, device.exp],
    )

    return Boolean(updateResult?.[1])
  }
}
