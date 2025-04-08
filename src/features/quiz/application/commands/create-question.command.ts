import { ICommandHandler } from "@nestjs/cqrs";
import { CommandHandler } from "@nestjs/cqrs";
import { CreateUpdateQuestionDto } from "../../api/models/input/question-input.dto";
import { QuizQuestionsRepository } from "../../infrastructure/quize-question.repository";
import { QuizQuestionsEntity } from "../../domain/postgres/quiz-questions.entity";

export class CreateQuestionCommand {
  constructor(public readonly createQuestionDto: CreateUpdateQuestionDto) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionCommandHandler implements ICommandHandler<CreateQuestionCommand> {
  constructor(private readonly quizQuestionsRepository: QuizQuestionsRepository) {}

  async execute(command: CreateQuestionCommand) {
    const question = QuizQuestionsEntity.createQuestionModel(command.createQuestionDto);
    return this.quizQuestionsRepository.createQuestion(question);
  }
}
