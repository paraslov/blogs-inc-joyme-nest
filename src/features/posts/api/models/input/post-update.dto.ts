import { PostCreateDto } from './post-create.dto'
import { PartialType } from '@nestjs/mapped-types'

export class PostUpdateDto extends PartialType(PostCreateDto) {}
