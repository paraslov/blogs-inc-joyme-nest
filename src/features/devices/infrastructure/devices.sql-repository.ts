import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class DevicesSqlRepository {
  constructor(protected dataSource: DataSource) {}

  async createDevicesTable() {
    const response = await this.dataSource.query(`
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

    console.log('@> createDevicesTable response: ', response)
  }
}
