import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { QuizQuestionsController } from './api/quiz-questions.controller'
import { QuizQuestionsCommandService } from './application/quiz-questions.command.service'
import { QuizQuestionsRepository } from './infrastructure/quize-question.repository'

@Module({
  imports: [CqrsModule],
  controllers: [QuizQuestionsController],
  providers: [QuizQuestionsCommandService, QuizQuestionsRepository],
})
export class QuizQuestionsModule {}
