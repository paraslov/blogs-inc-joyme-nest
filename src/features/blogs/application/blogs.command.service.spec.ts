import { Test, TestingModule } from '@nestjs/testing'
import { BlogsCommandService } from './blogs.command.service'

describe('BlogsService', () => {
  let service: BlogsCommandService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogsCommandService],
    }).compile()

    service = module.get<BlogsCommandService>(BlogsCommandService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
