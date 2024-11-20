import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { User } from '../domain/mongoose/users.entity'

@Injectable()
export class UsersSqlRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUsersTable() {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS public.users
        (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            email character varying(255) NOT NULL,
            login character varying(10) NOT NULL,
            password_hash character varying(255) NOT NULL,
            created_at timestamp without time zone NOT NULL DEFAULT NOW(),
            CONSTRAINT login UNIQUE (login),
            CONSTRAINT email UNIQUE (email),
            PRIMARY KEY (id)
        );
  
      ALTER TABLE IF EXISTS public.users
          OWNER to sa_sql_user;
    `)

    await this.dataSource.query(`
        CREATE TABLE IF NOT EXISTS public.users_confirmation_info
          (
              user_id uuid NOT NULL,
              confirmation_code uuid NOT NULL,
              confirmation_code_expiration_date timestamp without time zone NOT NULL,
              is_confirmed boolean NOT NULL,
              password_recovery_code uuid,
              password_recovery_code_expiration_date timestamp without time zone,
              is_password_recovery_confirmed boolean,
              PRIMARY KEY (user_id),
              CONSTRAINT link_with_users FOREIGN KEY (user_id)
                  REFERENCES public.users (id) MATCH SIMPLE
                  ON UPDATE NO ACTION
                  ON DELETE CASCADE
                  NOT VALID
          );

        ALTER TABLE IF EXISTS public.users_confirmation_info
            OWNER to sa_sql_user;
    `)
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
}
