import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { User } from '../domain/business_entity/users.entity'
import { UserSql } from '../domain/postgres/user.sql'
import { UserInfo } from '../domain/postgres/user-info.entity'

@Injectable()
export class UsersSqlRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async getUserById(userId: string): Promise<UserSql | null> {
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
    const res = await this.dataSource.query(
      `
      INSERT INTO public.users(login, email, password_hash, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `,
      [user.userData.login, user.userData.email, user.userData.passwordHash, user.userData.createdAt],
    )

    await this.dataSource.query(
      `
      INSERT INTO public.users_confirmation_info(
      user_id, confirmation_code, is_confirmed, confirmation_code_expiration_date)
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
  async updateUserAndInfo(user: UserSql, userInfo: UserInfo) {
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
