import { Module } from '@nestjs/common';
import { ContestModule } from 'src/game/contest/contest.module';
import { MapModule } from 'src/game/map/map/map.module';
import { TaskService } from './task.service';

@Module({
    imports: [MapModule, ContestModule],
    providers: [TaskService],
})
export class TaskModule {}
