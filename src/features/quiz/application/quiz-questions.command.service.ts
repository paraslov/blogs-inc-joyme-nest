import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { CreateUpdateQuestionDto } from '../api/models/input/question-input.dto'
import { CreateQuestionCommand } from './commands/create-question.command'

@Injectable()
export class QuizQuestionsCommandService {
  constructor(private readonly commandBus: CommandBus) {}

  createQuestion(createQuestionDto: CreateUpdateQuestionDto) {
    const command = new CreateQuestionCommand(createQuestionDto)
    return this.commandBus.execute(command)
  }
}
