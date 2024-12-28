import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../domain/business_entity/users'
import { UserEntity } from '../domain/postgres/user.entity'
import { UserInfoEntity } from '../domain/postgres/user-info.entity'

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity) private usersOrmRepository: Repository<UserEntity>,
    @InjectRepository(UserInfoEntity)
    private usersConfirmationInfoOrmRepository: Repository<UserInfoEntity>,
  ) {}

  async getUserById(userId: string): Promise<UserEntity | null> {
    const foundUser = await this.usersOrmRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.email', 'u.login', 'u.created_at'])
      .where(`id = :userId`, { userId })
      .getOne()

    return foundUser ?? null
  }

  async createUser(user: User) {
    const { userConfirmationData, userData } = user

    const newUser: UserEntity = UserEntity.createUser(userData)
    const { id: userId } = await this.usersOrmRepository.save(newUser)

    const newUserInfo: UserInfoEntity = UserInfoEntity.createUserInfo(userConfirmationData, userId)
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
  async updateUserAndInfo(user: UserEntity, userInfo: UserInfoEntity) {
    const userUpdateRes = await this.usersOrmRepository.update(user.id, user)

    const userInfoUpdateRes = await this.usersConfirmationInfoOrmRepository.update(user.id, userInfo)

    return Boolean(userUpdateRes.affected && userInfoUpdateRes.affected)
  }
}
