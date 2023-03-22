import { Module } from '@nestjs/common';
import { MapModule } from 'src/game/map/map/map.module';
import { TaskService } from './task.service';

@Module({
    imports: [MapModule],
    providers: [TaskService],
})
export class TaskModule {}
