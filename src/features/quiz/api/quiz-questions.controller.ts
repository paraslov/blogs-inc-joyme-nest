import { Controller, Post, Body } from '@nestjs/common'
import { QuizQuestionsCommandService } from '../application/quiz-questions.command.service'
import { CreateUpdateQuestionDto } from './models/input/question-input.dto'

@Controller('quiz/questions')
export class QuizQuestionsController {
  constructor(private readonly quizQuestionsCommandService: QuizQuestionsCommandService) {}

  @Post()
  createQuestion(@Body() createQuestionDto: CreateUpdateQuestionDto) {
    return this.quizQuestionsCommandService.createQuestion(createQuestionDto)
  }
}
