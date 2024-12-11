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
    const user = await this.dataSource.query(
      `
      SELECT id, login, email, password_hash, created_at
              FROM public.users
              WHERE id=$1
    `,
      [userId],
    )

    return user?.[0] ?? null
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
    const deleteResult = await this.dataSource.query(
      `
      DELETE FROM public.users
      WHERE id=$1;
    `,
      [userId],
    )

    return Boolean(deleteResult[1])
  }
  async confirmUser(confirmationCode: string) {
    const updateResult = await this.dataSource.query(
      `
      UPDATE public.users_confirmation_info
        SET is_confirmed=true
        WHERE confirmation_code=$1;
    `,
      [confirmationCode],
    )

    return updateResult?.[1] === 1
  }
  async updateUserAndInfo(user: UserDbModel, userInfo: UserInfo) {
    const userUpdateResult = await this.dataSource.query(
      `
        UPDATE public.users
          SET email=$2, login=$3, password_hash=$4
          WHERE id=$1;
    `,
      [user.id, user.email, user.login, user.password_hash],
    )

    const userInfoUpdateResult = await this.dataSource.query(
      `
        UPDATE public.users_confirmation_info
        SET confirmation_code=$2, confirmation_code_expiration_date=$3, is_confirmed=$4,
          password_recovery_code=$5, password_recovery_code_expiration_date=$6, is_password_recovery_confirmed=$7
        WHERE user_id=$1;
    `,
      [
        user.id,
        userInfo.confirmation_code,
        userInfo.confirmation_code_expiration_date,
        userInfo.is_confirmed,
        userInfo.password_recovery_code,
        userInfo.password_recovery_code_expiration_date,
        userInfo.is_password_recovery_confirmed,
      ],
    )

    return Boolean(userUpdateResult?.[1] && userInfoUpdateResult?.[1])
  }
}
