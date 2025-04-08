import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
  imports: [CqrsModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizQuestionsModule {}
