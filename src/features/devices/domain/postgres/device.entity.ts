import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Device } from '../business_entity/device'

@Entity('devices')
export class DeviceEntity {
  @PrimaryColumn({ type: 'uuid' })
  device_id: string

  @Column({ type: 'varchar', length: 255 })
  device_name: string

  @Column({ type: 'uuid' })
  user_id: string

  @Column({ type: 'varchar', length: 255 })
  ip: string

  @Column({ type: 'integer', nullable: true })
  iat: number

  @Column({ type: 'integer', nullable: true })
  exp: number

  static createDeviceModel(device: Device) {
    const newDevice = new DeviceEntity()

    newDevice.device_id = device.deviceId
    newDevice.device_name = device.deviceName
    newDevice.user_id = device.userId
    newDevice.ip = device.ip
    newDevice.iat = device.iat
    newDevice.exp = device.exp

    return newDevice
  }
}
