import { Injectable } from '@nestjs/common'
import { AuthMappers } from './auth.mappers'
import { DataSource } from 'typeorm'

@Injectable()
export class AuthQueryRepository {
  constructor(
    private readonly authMappers: AuthMappers,
    protected dataSource: DataSource,
  ) {}

  async getMeInformation(userId: string) {
    const user = await this.dataSource.query(
      `
      SELECT id, email, login, password_hash, created_at
        FROM public.users
        WHERE id = $1;
    `,
      [userId],
    )

    return this.authMappers.mapDbToOutputDto(user?.[0])
  }
}
