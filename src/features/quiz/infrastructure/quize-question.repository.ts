import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QuizQuestionsEntity } from "../domain/postgres/quiz-questions.entity";
import { CreateUpdateQuestionDto } from "../api/models/input/question-input.dto";

@Injectable()
export class QuizQuestionsRepository {
  constructor(
    @InjectRepository(QuizQuestionsEntity) 
    private readonly quizQuestionsOrmRepository: Repository<QuizQuestionsEntity>,
  ) {}

  async createQuestion(question: QuizQuestionsEntity): Promise<string | null> {
    const newQuestion = QuizQuestionsEntity.createQuestionModel(question);

    const createdQuestionResult = await this.quizQuestionsOrmRepository.save(newQuestion);
    return createdQuestionResult?.id ?? null;
  }

  async updateQuestion(questionId: string, updateQuestionDto: CreateUpdateQuestionDto) {
    const updatedQuestion = new QuizQuestionsEntity();
    updatedQuestion.body = updateQuestionDto.body;
    updatedQuestion.correctAnswers = updateQuestionDto.correctAnswers;

    const updateResult = await this.quizQuestionsOrmRepository.update({ id: questionId }, updatedQuestion);
    return Boolean(updateResult?.affected);
  }

  async deleteQuestion(questionId: string) {
    const deleteResult = await this.quizQuestionsOrmRepository.delete({ id: questionId });
    return Boolean(deleteResult?.affected);
  }

  async getQuestionDBModelById(questionId: string) {
    const foundQuestion = await this.quizQuestionsOrmRepository
      .createQueryBuilder('q')
      .select([
        'q.id',
        'q.body',
        'q.correct_answers',
        'q.published',
        'q.created_at',
        'q.updated_at'
      ])
      .where('q.id = :questionId', { questionId })
      .getOne();

    return foundQuestion ?? null;
  }

  async updateQuestionPublishStatus(questionId: string, published: boolean) {
    const updateResult = await this.quizQuestionsOrmRepository.update(
      { id: questionId },
      { published }
    );
    return Boolean(updateResult?.affected);
  }
}
