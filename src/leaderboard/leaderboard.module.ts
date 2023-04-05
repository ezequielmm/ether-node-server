import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { PlayerWinModule } from '../playerWin/playerWin.module';
import { ContestModule } from '../game/contest/contest.module';
import { ExpeditionModule } from 'src/game/components/expedition/expedition.module';
import { KindagooseModule } from 'kindagoose';
import { Expedition } from 'src/game/components/expedition/expedition.schema';

@Module({
    controllers: [LeaderboardController],
    imports: [
        KindagooseModule.forFeature([Expedition]),
    ],
    providers: [LeaderboardService],
})
export class LeaderboardModule {}
