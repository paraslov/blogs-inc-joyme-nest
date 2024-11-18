import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CreateUserDto } from './models/input/create-user.dto'
import { FilterUsersDto } from './models/input/filter-users.dto'
import { UsersQueryRepository } from '../infrastructure/users.query-repository'
import { HttpStatusCodes } from '../../../common/models'
import { UsersCommandService } from '../application/users.command.service'
import { SaAuthGuard } from '../../auth'
import { UsersSqlQueryRepository } from '../infrastructure/users.sql-query-repository'
import { UUIDValidationPipe } from '../../../base/pipes'

@UseGuards(SaAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersCommandService: UsersCommandService,
    private usersQueryRepository: UsersQueryRepository,
    private usersSqlQueryRepository: UsersSqlQueryRepository,
  ) {}

  @Get()
  getAll(@Query() query: FilterUsersDto) {
    return this.usersSqlQueryRepository.getUsers(query)
  }

  @Get(':userId')
  async getUser(@Param('userId', UUIDValidationPipe) userId: string) {
    const user = await this.usersSqlQueryRepository.getUser(userId)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const query = new FilterUsersDto()
    query.searchLoginTerm = createUserDto.login
    query.searchEmailTerm = createUserDto.email

    const foundUsers = await this.usersQueryRepository.getUsers(query)

    if (foundUsers.totalCount) {
      throw new BadRequestException('User with this login or email is already exists')
    }

    return this.usersCommandService.createUser(createUserDto)
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Delete(':id')
  async deleteOne(@Param('id', UUIDValidationPipe) id: string) {
    const deleteResult = await this.usersCommandService.deleteUser(id)
    if (!deleteResult) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
  }
}
