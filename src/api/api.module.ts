import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ExpeditionController } from './expedition.controller';
import { ExpeditionModule } from 'src/game/components/expedition/expedition.module';
import { ProcessModule } from 'src/game/process/process.module';
import { MerchantModule } from 'src/game/merchant/merchant.module';
import { ScoreCalculatorModule } from 'src/game/scoreCalculator/scoreCalculator.module';
import { TokenController } from './token.controller';
import { ShowVersionController } from './showVersion.controller';
import { ShowNftNetworkController } from './showNftNetwork.controller';
import { HighscoreController } from './highscore.controller';
import { PlayerGearModule } from '../playerGear/playerGear.module';
import { ContestModule } from '../game/contest/contest.module';
import { PlayerWinModule } from '../playerWin/playerWin.module';
import { ShowContestController } from './showContest.controller';
import { TroveModule } from 'src/trove/trove.module';

@Module({
    imports: [
        ExpeditionModule,
        ProcessModule,
        MerchantModule,
        ScoreCalculatorModule,
        PlayerGearModule,
        PlayerWinModule,
        ContestModule,
        TroveModule,
    ],
    controllers: [
        ProfileController,
        ExpeditionController,
        TokenController,
        ShowVersionController,
        ShowNftNetworkController,
        HighscoreController,
        ShowContestController,
    ],
})
export class ApiModule {}
