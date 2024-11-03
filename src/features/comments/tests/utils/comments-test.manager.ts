import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { HttpStatusCodes } from '../../../../common/models'
import { LikeStatus } from '../../../likes'
import { CommentViewDto } from '../../api/models/output/comment.view.dto'

export class CommentsTestManager {
  constructor(protected readonly app: INestApplication) {}
  httpSever = this.app.getHttpServer()

  async updateCommentLikeStatus(accessToken: string, updateData: { commentId: string, likeStatus: LikeStatus }) {
    await request(this.httpSever)
      .put(`/api/comments/${updateData.commentId}/like-status`)
      .auth(accessToken, {
        type: 'bearer',
      })
      .send({ likeStatus: updateData.likeStatus })
      .expect(HttpStatusCodes.NO_CONTENT_204)
  }

  async getCommentById(accessToken: string, commentId: string): Promise<CommentViewDto> {
    const response = await request(this.httpSever)
      .get(`/api/comments/${commentId}`)
      .auth(accessToken, {
        type: 'bearer',
      })
      .expect(HttpStatusCodes.OK_200)

    return response.body
  }
}
