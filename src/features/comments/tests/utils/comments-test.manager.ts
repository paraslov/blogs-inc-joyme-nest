import { INestApplication } from '@nestjs/common'

export class CommentsTestManager {
  constructor(protected readonly app: INestApplication) {}
  httpSever = this.app.getHttpServer()
  commentIndex = 0
}
