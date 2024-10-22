import { Injectable } from '@nestjs/common'
import { LikeDocument } from '../domain/mongoose/likes.entity'
import { LikeDetailsViewDto } from '../api/models/output/like-details-view.dto'

@Injectable()
export class LikesMappers {
  mapDtoToView(like: LikeDocument) {
    const mappedLike = new LikeDetailsViewDto()

    mappedLike.addedAt = like.createdAt.toISOString()
    mappedLike.login = like.userLogin
    mappedLike.userId = like.userId

    return mappedLike
  }
}
