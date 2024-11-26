import { Test, TestingModule } from '@nestjs/testing'
import { BlogsSaController } from './blogs.sa.controller'
import { BlogsCommandService } from '../application/blogs.command.service'

describe('BlogsController', () => {
  let controller: BlogsSaController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsSaController],
      providers: [BlogsCommandService],
    }).compile()

    controller = module.get<BlogsSaController>(BlogsSaController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
