import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { User } from '../domain/business_entity/users.entity'
import { UserDbModel, Users } from '../domain/postgres/user-db-model'
import { UserInfo, UsersConfirmationInfo } from '../domain/postgres/users-confirmation.info'

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Users) private usersOrmRepository: Repository<Users>,
    @InjectRepository(UsersConfirmationInfo)
    private usersConfirmationInfoOrmRepository: Repository<UsersConfirmationInfo>,
  ) {}

  async getUserById(userId: string): Promise<UserDbModel | null> {
    const foundUser = await this.usersOrmRepository.createQueryBuilder('u').select('*').where(`id=${userId}`).getOne()

    return foundUser ?? null
  }

  async createUser(user: User) {
    const { userConfirmationData, userData } = user
    const newUser: Users = new Users()
    newUser.email = userData.email
    newUser.login = userData.login
    newUser.password_hash = userData.passwordHash
    const { id: userId } = await this.usersOrmRepository.save(newUser)

    const newUserInfo: UsersConfirmationInfo = new UsersConfirmationInfo()
    newUserInfo.user_id = userId
    newUserInfo.confirmation_code = userConfirmationData.confirmationCode
    newUserInfo.is_confirmed = userConfirmationData.isConfirmed
    newUserInfo.confirmation_code_expiration_date = userConfirmationData.confirmationCodeExpirationDate
    await this.usersConfirmationInfoOrmRepository.save(newUserInfo)

    return userId
  }
  async deleteUser(userId: string) {
    const deleteRes = await this.usersOrmRepository.delete(userId)

    return Boolean(deleteRes.affected)
  }
  async confirmUser(confirmationCode: string) {
    const updateRes = await this.usersConfirmationInfoOrmRepository.update(confirmationCode, { is_confirmed: true })

    return updateRes.affected
  }
  async updateUserAndInfo(user: UserDbModel, userInfo: UserInfo) {
    const userUpdateRes = await this.usersOrmRepository.update(user.id, {
      email: user.email,
      login: user.login,
      password_hash: user.password_hash,
    })

    const userInfoUpdateRes = await this.usersConfirmationInfoOrmRepository.update(user.id, {
      confirmation_code: userInfo.confirmation_code,
      confirmation_code_expiration_date: userInfo.confirmation_code_expiration_date,
      is_confirmed: userInfo.is_confirmed,
      password_recovery_code: userInfo.password_recovery_code,
      password_recovery_code_expiration_date: userInfo.password_recovery_code_expiration_date,
      is_password_recovery_confirmed: userInfo.is_password_recovery_confirmed,
    })

    return Boolean(userUpdateRes.affected && userInfoUpdateRes.affected)
  }
}
