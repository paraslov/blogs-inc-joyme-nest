import { Module } from '@nestjs/common'
import { CommentsMongooseModule } from './domain/mongoose/comment.entity'

@Module({
  imports: [CommentsMongooseModule],
  exports: [CommentsMongooseModule],
  controllers: [],
  providers: [],
})
export class CommentsModule {}
