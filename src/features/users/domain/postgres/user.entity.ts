import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { UserData } from '../business_entity/users'

@Entity('users')
export class UserEntity {
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

  static createUser(userData: UserData) {
    const newUser = new UserEntity()
    newUser.email = userData.email
    newUser.login = userData.login
    newUser.password_hash = userData.passwordHash

    return newUser
  }
}
