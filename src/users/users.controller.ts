import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/createUserDto.js';
import { updateUserDto } from './dto/updateUserDto.js';
import { TokenAuthGuard } from '../auth/authguards/authTokenGuard.js';
import { TokenPayloadParam } from '../auth/param/tokenParam.js';
import { payLoadTokenDto } from '../auth/dto/payload.dto.js';

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

  @UseGuards(TokenAuthGuard)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: updateUserDto,
    @TokenPayloadParam() tokenPayload: payLoadTokenDto,
  ) {
    return this.usersService.update(id, body, tokenPayload);
  }

  @UseGuards(TokenAuthGuard)
  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: payLoadTokenDto,
  ) {
    return this.usersService.delete(id, tokenPayload);
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
}
