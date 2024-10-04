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
import { ObjectIdValidationPipe } from '../../../base/pipes/object.id.validation.pipe'
import { HttpStatusCodes } from '../../../common/models'
import { UsersCommandService } from '../application/users.command.service'
import { SaAuthGuard } from '../../auth/application/guards/sa-auth.guard'

@UseGuards(SaAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersCommandService: UsersCommandService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  getAll(@Query() query: FilterUsersDto) {
    return this.usersQueryRepository.getUsers(query)
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
  async deleteOne(@Param('id', ObjectIdValidationPipe) id: string) {
    const deleteResult = await this.usersCommandService.deleteUser(id)
    if (!deleteResult) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
  }
}
