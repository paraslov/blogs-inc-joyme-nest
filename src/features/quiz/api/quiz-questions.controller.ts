import { Controller } from "@nestjs/common";

@Controller('quiz')
export class QuizQuestionsController {
  constructor(private readonly quizService: QuizService) {}

  
}
