import { BadRequestException, Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity.js';
import { CreateTaskDto } from './dto/createTaskDto.js';
import { UpdateTaskDto } from './dto/updateTaskDto.js';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      name: 'Comprar pão',
      description: 'Comprar pão na padaria',
      completed: false,
    },
  ];

  FindAllTasks() {
    return this.tasks;
  }

  FindOneTask(id: string) {
    const task = this.tasks.find((task) => task.id === Number(id));
    if (!task) throw new BadRequestException('Tarefa não encontrada');
    return task;
  }

  create(body: CreateTaskDto) {
    const newId = this.tasks.length + 1;
    const task = { id: newId, ...body, completed: false };
    this.tasks.push(task);
    return task;
  }

  delete(id: string) {
    const taskDelete = this.tasks.filter((task) => task.id !== Number(id));
    if (taskDelete.length === this.tasks.length)
      throw new BadRequestException('Tarefa não encontrada');
    this.tasks = taskDelete;
    return this.tasks;
  }

  update(id: string, body: UpdateTaskDto) {
    const taskIndex = this.tasks.findIndex((task) => task.id === Number(id));
    if (taskIndex < 0) throw new BadRequestException('Tarefa não encontrada');
    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...body };
    return this.tasks[taskIndex];
  }
}
