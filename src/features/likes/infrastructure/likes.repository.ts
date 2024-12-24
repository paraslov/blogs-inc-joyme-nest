import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { LikesDbModel } from '../domain/postgres/likes-db-model'
import { Like } from '../domain/business_entity/likes.entity'
import { LikeStatus } from '../api/models/enums/like-status'
import { LikesMappers } from './likes.mappers'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class LikesRepository {
  constructor(
    @InjectRepository(LikesDbModel) private likesOrmRepository: Repository<LikesDbModel>,
    private likesMappers: LikesMappers,
  ) {}

  async getLikeStatusData(userId: string, parentId: string) {
    const likeStatusData = await this.likesOrmRepository
      .createQueryBuilder('l')
      .select(['l.parent_id', 'l.status', 'l.created_at', 'l.user_id', 'l.user_login'])
      .where('l.user_id = :userId', { userId })
      .andWhere('l.parent_id = :parentId', { parentId })
      .getOne()

    return likeStatusData ?? null
  }

  async getUserLikeStatus(parentId: string, userId?: string) {
    if (!userId) {
      return null
    }

    const userLikeStatus = await this.likesOrmRepository
      .createQueryBuilder('l')
      .select('l.status', 'status')
      .where('l.user_id = :userId', { userId })
      .andWhere('l.parent_id = :parentId', { parentId })
      .getRawOne()

    return userLikeStatus?.status ?? null
  }

  async getLatestLikes(parentId: string, likesCount: number = 3) {
    const latestLikesData = await this.likesOrmRepository
      .createQueryBuilder('l')
      .select(['l.parent_id', 'l.status', 'l.created_at', 'l.user_id', 'l.user_login'])
      .where('l.status = :status', { status: LikeStatus.LIKE })
      .andWhere('l.parent_id = :parentId', { parentId })
      .orderBy('created_at', 'DESC')
      .skip(0)
      .limit(likesCount)
      .getMany()

    return latestLikesData?.map(this.likesMappers.mapDtoToView) ?? []
  }

  async createLikeInfo(newLikeInfo: Like) {
    const newLikeModel = LikesDbModel.createLikeModel(newLikeInfo)

    await this.likesOrmRepository.save(newLikeModel)
  }

  async updateLikeStatus(likeStatusDto: Like, parentId: string) {
    const updateLikeModel = LikesDbModel.createLikeModel(likeStatusDto)

    const updateResult = await this.likesOrmRepository.update({ parent_id: parentId }, updateLikeModel)
    return Boolean(updateResult?.affected)
  }
}
