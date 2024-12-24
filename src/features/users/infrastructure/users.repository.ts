import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../domain/business_entity/users.entity'
import { UserDbModel } from '../domain/postgres/user-db-model'
import { UserInfo } from '../domain/postgres/user.info'

@Injectable()
export class UsersRepository {
  constructor(
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

    const newUser: UserDbModel = UserDbModel.createUser(userData)
    const { id: userId } = await this.usersOrmRepository.save(newUser)

    const newUserInfo: UserInfo = UserInfo.createUserInfo(userConfirmationData, userId)
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
    const userUpdateRes = await this.usersOrmRepository.update(user.id, user)

    const userInfoUpdateRes = await this.usersConfirmationInfoOrmRepository.update(user.id, userInfo)

    return Boolean(userUpdateRes.affected && userInfoUpdateRes.affected)
  }
}
