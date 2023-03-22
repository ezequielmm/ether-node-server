import { Module } from '@nestjs/common';
import { TaskService } from './task.service';

@Module({
    imports: [TaskService],
})
export class TaskModule {}
