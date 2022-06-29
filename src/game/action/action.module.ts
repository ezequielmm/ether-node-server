import { Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { ProcessModule } from '../process/process.module';
import { FullSyncAction } from './fullSync.action';
import { GetCardPilesAction } from './getCardPiles.action';
import { GetEnemiesAction } from './getEnemies.action';
import { GetEnergyAction } from './getEnergy.action';
import { GetPlayerInfoAction } from './getPlayerInfo.action';
import { SetCombatTurnAction } from './setCombatTurn.action';

@Module({
    imports: [ExpeditionModule, ProcessModule],
    providers: [
        FullSyncAction,
        SetCombatTurnAction,
        GetEnergyAction,
        GetCardPilesAction,
        GetEnemiesAction,
        GetPlayerInfoAction,
    ],
    exports: [
        FullSyncAction,
        SetCombatTurnAction,
        GetEnergyAction,
        GetCardPilesAction,
        GetEnemiesAction,
        GetPlayerInfoAction,
    ],
})
export class ActionModule {}
