import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { Task } from './entities/task.entity.js';
import { CreateTaskDto } from './dto/createTaskDto.js';
import { UpdateTaskDto } from './dto/updateTaskDto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaginationDto } from './dto/pagination.dto.js';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async FindAllTasks(@Query() params: PaginationDto) {
    const { limit = 10, offset = 0 } = params;
    const allTasks = await this.prisma.task.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return allTasks;
  }

  async FindOneTask(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) throw new BadRequestException('Tarefa não encontrada');
    return task;
  }

  async create(createTaskDto: CreateTaskDto) {
    try {
      const newTask = await this.prisma.task.create({
        data: {
          name: createTaskDto.name,
          description: createTaskDto.description,
          completed: false,
          userId: createTaskDto.userId,
        },
      });
      return newTask;
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Erro ao criar tarefa');
    }
  }

  async delete(id: number) {
    const task = await this.prisma.task.delete({
      where: { id },
    });
    if (!task) throw new BadRequestException('Tarefa não encontrada');
    return task;
  }

  async update(id: number, body: UpdateTaskDto) {
    const task = await this.prisma.task.update({
      where: { id },
      data: body,
    });
    if (!task) throw new BadRequestException('Tarefa não encontrada');
    return task;
  }
}
