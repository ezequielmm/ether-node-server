import { Module } from '@nestjs/common';
import { ContestModule } from 'src/game/contest/contest.module';
import { ContestMapModule } from 'src/game/contestMap/contestMap.module';
import { MapBuilderModule } from 'src/game/map/builder/mapBuilder.module';
import { SettingsModule } from 'src/game/components/settings/settings.module';
import { Expedition } from 'src/game/components/expedition/expedition.schema';
import { OldExpedition } from 'src/game/components/expedition/oldexpedition.schema';

@Module({
    imports: [],
    providers: [Expedition, OldExpedition],
})
export class CleanModule {}
