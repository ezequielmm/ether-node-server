import { Module } from '@nestjs/common';
import { ContestModule } from 'src/game/contest/contest.module';
import { ContestMapModule } from 'src/game/contestMap/contestMap.module';
import { TaskService } from './task.service';
import { MapBuilderModule } from 'src/game/map/builder/mapBuilder.module';
import { SettingsModule } from 'src/game/components/settings/settings.module';

@Module({
    imports: [MapBuilderModule, ContestModule, ContestMapModule, SettingsModule],
    providers: [TaskService],
})
export class TaskModule {}
