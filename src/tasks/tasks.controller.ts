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
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/createTaskDto.js';
import { UpdateTaskDto } from './dto/updateTaskDto.js';
import { PaginationDto } from './dto/pagination.dto.js';
import { LoggerInterceptor } from '../interceptors/logger.interceptor.js';
import { BodyCreateTaskInterceptor } from '../interceptors/body-create-task.interceptor.js';
import { AddHeaderInterceptor } from '../interceptors/add-header.interceptor.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseInterceptors(LoggerInterceptor, AddHeaderInterceptor)
  FindAllTasks(@Query() params: PaginationDto) {
    return this.tasksService.FindAllTasks(params);
  }

  @Get(':id')
  FindOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.FindOneTask(id);
  }

  @Post(':userId')
  @UseInterceptors(BodyCreateTaskInterceptor)
  createTask(
    @Param('userId', ParseIntPipe) userId: string,
    @Body() body: CreateTaskDto,
  ) {
    return this.tasksService.create(body, userId);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.delete(id);
  }

  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, body);
  }
}
