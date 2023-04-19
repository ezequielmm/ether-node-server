import { Module } from '@nestjs/common';
import { ContestModule } from 'src/game/contest/contest.module';
import { ContestMapModule } from 'src/game/contestMap/contestMap.module';
import { TaskService } from './task.service';
import { MapBuilderModule } from 'src/game/map/builder/mapBuilder.module';

@Module({
    imports: [MapBuilderModule, ContestModule, ContestMapModule],
    providers: [TaskService],
})
export class TaskModule {}
