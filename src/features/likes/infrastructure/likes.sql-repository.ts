import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { LikesSql } from '../domain/postgres/likes-sql'
import { Like } from '../domain/mongoose/likes.entity'

@Injectable()
export class LikesSqlRepository {
  constructor(private dataSource: DataSource) {}

  async getLikeStatus(userId: string, parentId: string) {
    const likeStatus = await this.dataSource.query<LikesSql[]>(
      `
      SELECT parent_id, status, created_at, user_id, user_login
        FROM public.likes
        WHERE user_id = $1 AND parent_id = $2;
    `,
      [userId, parentId],
    )

    return likeStatus?.[0]
  }

  async createLikeStatus(newLikeStatus: Like) {
    const { parentId, status, userId, userLogin, createdAt } = newLikeStatus
    await this.dataSource.query(
      `
        INSERT INTO public.likes(
            parent_id, status, created_at, user_id, user_login)
            VALUES ($1, $2, $3, $4, $5);
    `,
      [parentId, status, createdAt, userId, userLogin],
    )
  }

  async updateLikeStatus(likeStatusDto: Like, parentId: string) {
    const { status, userId, userLogin, createdAt } = likeStatusDto
    const updateResult = await this.dataSource.query(
      `
        UPDATE public.likes
            SET status=$2, created_at=$3, user_id=$4, user_login=$5
            WHERE parent_id=$1;
    `,
      [parentId, status, createdAt, userId, userLogin],
    )

    return Boolean(updateResult?.[1])
  }
}
