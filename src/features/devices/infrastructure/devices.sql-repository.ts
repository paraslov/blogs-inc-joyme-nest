import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Device } from '../domain/mongoose/device.entity'

@Injectable()
export class DevicesSqlRepository {
  constructor(protected dataSource: DataSource) {}

  async createDevicesTable() {
    await this.dataSource.query(`
    CREATE TABLE IF NOT EXISTS public.devices
      (
          device_id uuid NOT NULL,
          device_name character varying(255) NOT NULL,
          user_id uuid NOT NULL,
          ip character varying(255) NOT NULL,
          iat integer,
          exp integer,
          PRIMARY KEY (device_id)
      );

      ALTER TABLE IF EXISTS public.devices
          OWNER to sa_sql_user;
    `)

    console.log('@> createDevicesTable')
  }

  async getDeviceById(deviceId: string) {
    const result = await this.dataSource.query(
      `
      SELECT device_id, device_name, user_id, ip, iat, exp
        FROM public.devices d
        WHERE d.device_id=$1;
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
        VALUES ($1, $2, $3, $4, $5, $6);
    `,
      [device.deviceId, device.deviceName, device.userId, device.ip, device.iat, device.exp],
    )

    return createResult?.[0]
  }
}
