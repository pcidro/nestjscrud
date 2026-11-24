import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Task } from './entities/task.entity.js';
import { CreateTaskDto } from './dto/createTaskDto.js';
import { UpdateTaskDto } from './dto/updateTaskDto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaginationDto } from './dto/pagination.dto.js';
import { payLoadTokenDto } from '../auth/dto/payload.dto.js';

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
    if (!task)
      throw new HttpException('Tarefa não encontrada', HttpStatus.NOT_FOUND);
    return task;
  }

  async create(createTaskDto: CreateTaskDto, tokenPayload: payLoadTokenDto) {
    try {
      const newTask: Task = await this.prisma.task.create({
        data: {
          name: createTaskDto.name,
          description: createTaskDto.description,
          completed: false,
          userId: tokenPayload.sub,
        },
      });
      return newTask;
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Erro ao criar tarefa');
    }
  }

  async delete(id: number, tokenPayload: payLoadTokenDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) throw new NotFoundException('Tarefa não encontrada');

    if (task.userId !== tokenPayload.sub)
      throw new ForbiddenException('Você não pode excluir esta tarefa');

    return await this.prisma.task.delete({
      where: {
        id,
        userId: tokenPayload.sub,
      },
    });
  }

  async update(id: number, body: UpdateTaskDto, tokenPayload: payLoadTokenDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) throw new NotFoundException('Tarefa não encontrada');

    if (task.userId !== tokenPayload.sub)
      throw new ForbiddenException('Você não pode atualizar esta tarefa');

    return await this.prisma.task.update({
      where: {
        id,
        userId: tokenPayload.sub,
      },
      data: body,
    });
  }
}
