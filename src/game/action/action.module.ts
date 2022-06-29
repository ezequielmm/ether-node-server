import { Module } from '@nestjs/common';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { EffectModule } from '../effects/effects.module';
import { ProcessModule } from '../process/process.module';
import { CardPlayedAction } from './cardPlayed.action';
import { FullSyncAction } from './fullSync.action';
import { GetCardPilesAction } from './getCardPiles.action';
import { GetEnemiesAction } from './getEnemies.action';
import { GetEnergyAction } from './getEnergy.action';
import { GetPlayerInfoAction } from './getPlayerInfo.action';
import { SetCombatTurnAction } from './setCombatTurn.action';
import { UpdatePlayerEnergyAction } from './updatePlayerEnergy.action';

@Module({
    imports: [ExpeditionModule, ProcessModule, EffectModule],
    providers: [
        FullSyncAction,
        SetCombatTurnAction,
        GetEnergyAction,
        GetCardPilesAction,
        GetEnemiesAction,
        GetPlayerInfoAction,
        CardPlayedAction,
        UpdatePlayerEnergyAction,
    ],
    exports: [
        FullSyncAction,
        SetCombatTurnAction,
        GetEnergyAction,
        GetCardPilesAction,
        GetEnemiesAction,
        GetPlayerInfoAction,
        CardPlayedAction,
        UpdatePlayerEnergyAction,
    ],
})
export class ActionModule {}
