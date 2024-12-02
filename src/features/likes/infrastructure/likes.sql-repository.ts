import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { LikesSql } from '../domain/postgres/likes-sql'
import { Like } from '../domain/mongoose/likes.entity'
import { LikeStatus } from '../api/models/enums/like-status'
import { LikesMappers } from './likes.mappers'

@Injectable()
export class LikesSqlRepository {
  constructor(
    private dataSource: DataSource,
    private likesMappers: LikesMappers,
  ) {}

  async getLikeStatusData(userId: string, parentId: string) {
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

  async getUserLikeStatus(parentId: string, userId?: string) {
    if (!userId) {
      return
    }
    const userLikeData = await this.dataSource.query<{ status: LikeStatus }[]>(
      `
      SELECT status
        FROM public.likes
        WHERE user_id = $1 AND parent_id = $2;
    `,
      [userId, parentId],
    )

    return userLikeData?.[0]?.status
  }

  async getLatestLikes(parentId: string, likesCount: number = 3) {
    const latestLikeData = await this.dataSource.query<LikesSql[]>(
      `
      SELECT parent_id, status, created_at, user_id, user_login
        FROM public.likes
        WHERE parent_id=$1 AND status=$3
        ORDER BY created_at DESC
        LIMIT $2 OFFSET 0;
    `,
      [parentId, likesCount, LikeStatus.LIKE],
    )

    return latestLikeData?.map(this.likesMappers.mapDtoToView) ?? []
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
