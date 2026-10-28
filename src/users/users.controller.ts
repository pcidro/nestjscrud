import { Controller } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return `teste ${id}`;
  }
}
