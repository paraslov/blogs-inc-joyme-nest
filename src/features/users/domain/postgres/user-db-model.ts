import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { User, UserData } from '../business_entity/users.entity'

@Entity('users')
export class UserDbModel {
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
    const newUser = new UserDbModel()
    newUser.email = userData.email
    newUser.login = userData.login
    newUser.password_hash = userData.passwordHash

    return newUser
  }
}
