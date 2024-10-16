import { LikeStatus } from '../enums/like-status'
import { IsEnum } from 'class-validator'

export class UpdateLikeStatusDto {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus
}
