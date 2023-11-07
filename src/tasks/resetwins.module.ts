import { Module } from '@nestjs/common';
import { ContestModule } from 'src/game/contest/contest.module';
import { ContestMapModule } from 'src/game/contestMap/contestMap.module';
import { MapBuilderModule } from 'src/game/map/builder/mapBuilder.module';
import { SettingsModule } from 'src/game/components/settings/settings.module';
import { Expedition } from 'src/game/components/expedition/expedition.schema';
import { OldExpedition } from 'src/game/components/expedition/oldexpedition.schema';
import { ResetService } from './reset.service';
import { KindagooseModule } from 'kindagoose';
import { MapType } from 'src/game/components/expedition/map.schema';
import { OldMapType } from 'src/game/components/expedition/oldmap.schema';
import { PlayerWin } from 'src/playerWin/playerWin.schema';
import { ResetWinsService } from './resetwins.service';

@Module({
    imports: [
        KindagooseModule.forFeature([PlayerWin]),

    ],
    providers: [ResetWinsService],
})
export class ResetWinModule { }
