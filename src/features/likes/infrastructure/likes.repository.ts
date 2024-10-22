import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Like } from '../domain/mongoose/likes.entity'
import { Model } from 'mongoose'
import { LikeStatus } from '../api/models/enums/like-status'
import { LikesMappers } from './likes.mappers'

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(Like.name) private readonly likesModel: Model<Like>,
    private likesMappers: LikesMappers,
  ) {}

  getLikeStatus(userId: string, parentId: string) {
    return this.likesModel.findOne({ userId, parentId })
  }
  async updateLikeStatus(likeStatusDto: Like, parentId: string) {
    const updateResult = await this.likesModel.updateOne({ userId: likeStatusDto.userId, parentId }, likeStatusDto)

    return Boolean(updateResult.matchedCount)
  }
  async saveLikeStatus(like: Like) {
    const savedLikeStatus = await new this.likesModel(like).save()

    return savedLikeStatus._id.toString()
  }
  async getUserLikeStatus(parentId: string, userId?: string) {
    if (!userId) {
      return
    }
    const userLikeData = await this.likesModel.findOne({ userId, parentId })

    return userLikeData?.status
  }
  async getLatestLikes(parentId: string, likesCount: number = 3) {
    const likes = await this.likesModel
      .find({ parentId, status: LikeStatus.LIKE })
      .sort({ createdAt: -1 })
      .limit(likesCount)

    return likes?.map(this.likesMappers.mapDtoToView) ?? []
  }
}
