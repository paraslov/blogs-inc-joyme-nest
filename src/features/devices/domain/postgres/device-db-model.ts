import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Devices {
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
}
