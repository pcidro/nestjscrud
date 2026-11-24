import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/createTaskDto.js';
import { UpdateTaskDto } from './dto/updateTaskDto.js';
import { PaginationDto } from './dto/pagination.dto.js';
import { TokenAuthGuard } from '../auth/authguards/authTokenGuard.js';
import { TokenPayloadParam } from '../auth/param/tokenParam.js';
import { payLoadTokenDto } from '../auth/dto/payload.dto.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  FindAllTasks(@Query() params: PaginationDto) {
    return this.tasksService.FindAllTasks(params);
  }

  @Get(':id')
  FindOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.FindOneTask(id);
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  createTask(
    @Body() body: CreateTaskDto,
    @TokenPayloadParam() tokenPayload: payLoadTokenDto,
  ) {
    return this.tasksService.create(body, tokenPayload);
  }

  @UseGuards(TokenAuthGuard)
  @Delete(':id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    tokenPayload: payLoadTokenDto,
  ) {
    return this.tasksService.delete(id, tokenPayload);
  }

  @UseGuards(TokenAuthGuard)
  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto,
    tokenPayload: payLoadTokenDto,
  ) {
    return this.tasksService.update(id, body, tokenPayload);
  }
}
