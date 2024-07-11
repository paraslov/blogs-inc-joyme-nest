import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common'
import { UsersService } from '../application/users.service'
import { CreateUserDto } from './models/input/create-user.dto'
import { FilterUsersDto } from './models/input/filter-users.dto'
import { UsersQueryRepository } from '../infrastructure/users.query-repository'

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  getAll(@Query(new ValidationPipe({ transform: true })) query: FilterUsersDto) {
    return this.usersQueryRepository.getUsers(query)
  }

  @Post()
  create(@Body(new ValidationPipe({ transform: true })) createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto)
  }
}
