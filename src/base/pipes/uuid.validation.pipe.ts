import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { validate as isUUID } from 'uuid'

@Injectable()
export class UUIDValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!isUUID(value)) {
      throw new BadRequestException('Invalid UUID')
    }
    return value
  }
}
