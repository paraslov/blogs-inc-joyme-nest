import { IsEnum, IsOptional, IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";
import { StandardInputFilters } from "src/common/models/input/QueryInputParams";
import { Transform } from 'class-transformer';
import { TrimmedString } from '../../../../../base/decorators';

export enum PublishedStatus {
  ALL = 'all',
  PUBLISHED = 'published',
  NOT_PUBLISHED = 'notPublished'
}

enum QuestionSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  BODY = 'body',
  PUBLISHED = 'published'
}

export class QuestionFilterDto extends StandardInputFilters {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bodySearchTerm: string;

  @IsOptional()
  @IsEnum(PublishedStatus)
  publishedStatus: PublishedStatus = PublishedStatus.ALL;

  @IsOptional()
  @TrimmedString()
  @IsEnum(QuestionSortBy)
  @Transform(({ value }) => (!value ? 'createdAt' : value))
  sortBy: string = 'createdAt';
}
