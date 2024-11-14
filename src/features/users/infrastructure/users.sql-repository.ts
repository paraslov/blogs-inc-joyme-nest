import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { User } from '../domain/mongoose/users.entity'

@Injectable()
export class UsersSqlRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser(user: User) {
    const res = await this.dataSource.query(
      `
      INSERT INTO public.users(login, email, "passwordHash", "createdAt")
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `,
      [user.userData.login, user.userData.email, user.userData.passwordHash, user.userData.createdAt],
    )

    await this.dataSource.query(
      `
      INSERT INTO public."usersConfirmationInfo"(
      "userId", "confirmationCode", "isConfirmed", "confirmationExpirationDate")
      VALUES ($4, $1, $2, $3);
    `,
      [
        user.userConfirmationData.confirmationCode,
        user.userConfirmationData.isConfirmed,
        user.userConfirmationData.confirmationCodeExpirationDate,
        res[0].id,
      ],
    )

    return res[0].id
  }
}
