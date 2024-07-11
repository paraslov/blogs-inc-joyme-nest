import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common'
import { UsersService } from '../application/users.service'
import { CreateUserDto } from './models/input/create-user.dto'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAll() {
    return 'list of users'
  }

  @Post()
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto)
  }
}
