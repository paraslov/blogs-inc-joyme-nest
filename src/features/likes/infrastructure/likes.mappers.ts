import { Injectable } from '@nestjs/common'
import { LikeDetailsViewDto } from '../api/models/output/like-details-view.dto'
import { LikesEntity } from '../domain/postgres/likes.entity'

@Injectable()
export class LikesMappers {
  mapDtoToView(like: LikesEntity) {
    const mappedLike = new LikeDetailsViewDto()

    mappedLike.addedAt = like.created_at.toISOString()
    mappedLike.login = like.user_login
    mappedLike.userId = like.user_id

    return mappedLike
  }
}
