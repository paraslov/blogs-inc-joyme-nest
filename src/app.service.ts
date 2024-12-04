import { Injectable, NotFoundException } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { deleteAllData } from './common/tests'

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  getHello(): string {
    return 'Welcome to JoymeStudios Blogs App!'
  }
  getVersion(): string {
    return 'blogs-inc-joyme: v5.4.0'
  }
  async deleteAllData() {
    try {
      await deleteAllData(this.dataSource)
    } catch (err) {
      throw new NotFoundException(`Failed to clear data: ${err.message}`)
    }
  }
}
