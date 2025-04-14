import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { CreateUpdateQuestionDto } from '../../api/models/input/question-input.dto'

@Entity('quiz_questions')
export class QuizQuestionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  body: string

  @Column('jsonb')
  correctAnswers: string[]

  @Column({ default: false })
  published: boolean

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date

  static createQuestionModel(question: CreateUpdateQuestionDto): QuizQuestionsEntity {
    const quizQuestion = new QuizQuestionsEntity()

    quizQuestion.body = question.body
    quizQuestion.correctAnswers = question.correctAnswers
    quizQuestion.published = false
    quizQuestion.createdAt = new Date()
    quizQuestion.updatedAt = new Date()

    return quizQuestion
  }
}
