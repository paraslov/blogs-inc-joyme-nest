import { Injectable } from '@nestjs/common'
import { QuizQuestionsEntity } from '../domain/postgres/quiz-questions.entity'
import { QuestionViewDto } from '../api/models/output/question-view.dto'

@Injectable()
export class QuizQuestionMappers {
  mapToDto(question: QuizQuestionsEntity): QuestionViewDto {
    return {
      id: question.id,
      body: question.body,
      correctAnswers: question.correctAnswers,
      published: question.published,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
