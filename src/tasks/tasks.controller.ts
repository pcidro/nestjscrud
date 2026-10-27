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
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/createTaskDto.js';
import { UpdateTaskDto } from './dto/updateTaskDto.js';
import { PaginationDto } from './dto/pagination.dto.js';

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

  @Post()
  createTask(@Body() body: CreateTaskDto) {
    return this.tasksService.create(body);
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
