import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UsersConfirmationInfo } from './users-confirmation.info'

export class UserDbModel {
  id: string
  login: string
  email: string
  password_hash: string
  created_at: Date
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true, length: 10 })
  login: string

  @Column({ unique: true })
  email: string

  @Column()
  password_hash: string

  @CreateDateColumn()
  created_at: Date
}
