import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { QuizQuestionsEntity } from '../domain/postgres/quiz-questions.entity'
import { QuestionViewDto } from '../api/models/output/question-view.dto'
import { QuizQuestionMappers } from './quiz-question.mappers'
import { PublishedStatus, QuestionFilterDto } from '../api/models/input/question-filter.dto'
import { SortDirection } from 'src/common/models/enums/sort-direction'
import { camelToSnakeUtil } from '../../../common/utils'

@Injectable()
export class QuizQuestionQueryRepository {
  constructor(
    @InjectRepository(QuizQuestionsEntity)
    private readonly quizQuestionsRepository: Repository<QuizQuestionsEntity>,
    private readonly quizQuestionMappers: QuizQuestionMappers,
  ) {}

  async findAll(filter: QuestionFilterDto) {
    const { bodySearchTerm, publishedStatus, sortBy, sortDirection, pageNumber, pageSize } = filter
    const offset = (pageNumber - 1) * pageSize
    const direction = sortDirection === SortDirection.DESC ? 'DESC' : 'ASC'
    const sortBySnakeCase = camelToSnakeUtil(sortBy)

    const query = this.quizQuestionsRepository
      .createQueryBuilder('q')
      .select(['q.id', 'q.body', 'q.correct_answers', 'q.published', 'q.created_at', 'q.updated_at'])

    if (bodySearchTerm) {
      query.andWhere('q.body ILIKE :bodySearchTerm', { bodySearchTerm: `%${bodySearchTerm}%` })
    }

    if (publishedStatus !== PublishedStatus.ALL) {
      query.andWhere('q.published = :published', { published: publishedStatus === PublishedStatus.PUBLISHED })
    }

    const [questions, totalCount] = await query
      .orderBy(`q.${sortBySnakeCase}`, direction)
      .skip(offset)
      .take(pageSize)
      .getManyAndCount()

    const mappedQuestions = questions.map((question) => this.quizQuestionMappers.mapToDto(question))
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount,
      totalCount,
      pageSize,
      page: pageNumber,
      items: mappedQuestions,
    }
  }

  async findById(id: string): Promise<QuestionViewDto | null> {
    const question = await this.quizQuestionsRepository
      .createQueryBuilder('q')
      .select(['q.id', 'q.body', 'q.correct_answers', 'q.published', 'q.created_at', 'q.updated_at'])
      .where('q.id = :id', { id })
      .getOne()

    return question ? this.quizQuestionMappers.mapToDto(question) : null
  }
}
