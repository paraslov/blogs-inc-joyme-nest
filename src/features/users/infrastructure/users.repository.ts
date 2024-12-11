import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { User } from '../domain/business_entity/users.entity'
import { UserDbModel } from '../domain/postgres/user-db-model'
import { UserInfo } from '../domain/postgres/user.info'

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(UserDbModel) private usersOrmRepository: Repository<UserDbModel>,
    @InjectRepository(UserInfo)
    private usersConfirmationInfoOrmRepository: Repository<UserInfo>,
  ) {}

  async getUserById(userId: string): Promise<UserDbModel | null> {
    const foundUser = await this.usersOrmRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.email', 'u.login', 'u.created_at'])
      .where(`id = :userId`, { userId })
      .getOne()

    return foundUser ?? null
  }

  async createUser(user: User) {
    const { userConfirmationData, userData } = user
    const newUser: UserDbModel = new UserDbModel()
    newUser.email = userData.email
    newUser.login = userData.login
    newUser.password_hash = userData.passwordHash
    const { id: userId } = await this.usersOrmRepository.save(newUser)

    const newUserInfo: UserInfo = new UserInfo()
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
    const updateRes = await this.usersConfirmationInfoOrmRepository.update(
      { confirmation_code: confirmationCode },
      { is_confirmed: true },
    )

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
