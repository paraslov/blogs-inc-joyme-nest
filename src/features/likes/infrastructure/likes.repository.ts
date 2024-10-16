import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Like } from '../domain/mongoose/likes.entity'
import { Model } from 'mongoose'

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Like.name) private readonly likesModel: Model<Like>) {}

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
}
