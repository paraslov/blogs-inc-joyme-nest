import { Controller, Get, Post } from '@nestjs/common'

@Controller('users')
export class UsersController {
  @Get()
  getAll() {
    return 'list of users'
  }

  @Post()
  create() {
    return 'user created'
  }
}
