import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class LikesSqlRepository {
  constructor(private dataSource: DataSource) {}
}
