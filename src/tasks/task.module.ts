import { Module } from '@nestjs/common';
import { ContestModule } from 'src/game/contest/contest.module';
import { ContestMapModule } from 'src/game/contestMap/contestMap.module';
import { TaskService } from './task.service';
import { MapPopulationModule } from 'src/game/map/mapPopulation.module';

@Module({
    imports: [MapPopulationModule, ContestModule, ContestMapModule],
    providers: [TaskService],
})
export class TaskModule {}
