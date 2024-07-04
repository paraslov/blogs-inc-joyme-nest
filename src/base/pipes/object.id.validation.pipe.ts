import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { Types } from 'mongoose'

@Injectable()
export class ObjectIdValidationPipe
  implements PipeTransform<string, Promise<string>>
{
  async transform(value: string): Promise<string> {
    const isValidObjectId = Types.ObjectId.isValid(value)
    if (!isValidObjectId) {
      throw new BadRequestException('Invalid ObjectId')
    }
    return value
  }
}
