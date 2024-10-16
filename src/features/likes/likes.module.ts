import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { LikesMongooseModule } from './domain/mongoose/likes.entity'
import { LikesRepository } from './infrastructure/likes.repository'

@Module({
  imports: [CqrsModule, LikesMongooseModule],
  exports: [LikesMongooseModule],
  providers: [LikesRepository],
})
export class LikesModule {}
