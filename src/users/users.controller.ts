import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { Get, Param, ParseIntPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneUser(id);
  }

  @Post()
  CreateUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
}
