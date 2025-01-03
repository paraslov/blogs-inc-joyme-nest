import { Injectable } from '@nestjs/common'
import { AuthMappers } from './auth.mappers'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../../users'

@Injectable()
export class AuthQueryRepository {
  constructor(
    private readonly authMappers: AuthMappers,
    @InjectRepository(UserEntity) private usersOrmRepository: Repository<UserEntity>,
  ) {}

  async getMeInformation(userId: string) {
    const foundUser = await this.usersOrmRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.email', 'u.login', 'u.password_hash', 'u.created_at'])
      .where('u.id = :userId', { userId })
      .getOne()

    return this.authMappers.mapDbToOutputDto(foundUser)
  }
}
