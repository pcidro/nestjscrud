import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from '../filters/exceptionfilter.js';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
  ],
})
export class TasksModule {}
