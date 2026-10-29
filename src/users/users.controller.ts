import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { Get, Param, ParseIntPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.js';
import { updateUserDto } from './dto/updateUserDto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneUser(id);
  }

  @Get()
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: updateUserDto,
  ) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }

  @Post()
  CreateUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
}
