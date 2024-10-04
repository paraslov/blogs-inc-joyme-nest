import { Test, TestingModule } from '@nestjs/testing'
import { BlogsController } from './blogs.controller'
import { BlogsCommandService } from '../application/blogs.command.service'

describe('BlogsController', () => {
  let controller: BlogsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [BlogsCommandService],
    }).compile()

    controller = module.get<BlogsController>(BlogsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
