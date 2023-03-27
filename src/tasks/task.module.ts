import { Module } from '@nestjs/common';
import { ContestModule } from 'src/game/contest/contest.module';
import { ContestMapModule } from 'src/game/contestMap/contestMap.module';
import { MapModule } from 'src/game/map/map/map.module';
import { TaskService } from './task.service';

@Module({
    imports: [MapModule, ContestModule, ContestMapModule],
    providers: [TaskService],
})
export class TaskModule {}
