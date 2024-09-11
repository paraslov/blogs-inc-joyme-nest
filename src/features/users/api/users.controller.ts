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
import { UsersService } from '../application/users.service'
import { CreateUserDto } from './models/input/create-user.dto'
import { FilterUsersDto } from './models/input/filter-users.dto'
import { UsersQueryRepository } from '../infrastructure/users.query-repository'
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'
import { HttpStatusCodes } from '../../../common/models'
import { JwtAuthGuard } from '../../auth/application/guards/jwt-auth.guard'

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  getAll(@Query() query: FilterUsersDto) {
    return this.usersQueryRepository.getUsers(query)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const foundUsers = await this.usersQueryRepository.getUsers({
      searchEmailTerm: createUserDto.email,
      searchLoginTerm: createUserDto.login,
    })

    if (foundUsers.totalCount) {
      throw new BadRequestException('User with this login or email is already exists')
    }

    return this.usersService.createUser(createUserDto)
  }

  @HttpCode(HttpStatusCodes.NO_CONTENT_204)
  @Delete(':id')
  async deleteOne(@Param('id', ObjectIdValidationPipe) id: string) {
    const deleteResult = await this.usersService.deleteUser(id)
    if (!deleteResult) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
  }
}
