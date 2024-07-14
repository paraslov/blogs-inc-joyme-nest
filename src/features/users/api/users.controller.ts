import { BadRequestException, Body, Controller, Delete, Get, Post, Query, ValidationPipe } from '@nestjs/common'
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
  async create(@Body(new ValidationPipe({ transform: true })) createUserDto: CreateUserDto) {
    const foundUsers = await this.usersQueryRepository.getUsers({
      searchEmailTerm: createUserDto.email,
      searchLoginTerm: createUserDto.login,
    })

    if (foundUsers.totalCount) {
      throw new BadRequestException('User with this login or email is already exists')
    }

    return this.usersService.createUser(createUserDto)
  }
}
