import { forwardRef, Module } from '@nestjs/common';
import { CardModule } from '../components/card/card.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { SettingsModule } from '../components/settings/settings.module';
import { EffectModule } from '../effects/effects.module';
import { ProcessModule } from '../process/process.module';
import { StatusModule } from '../status/status.module';
import { CardPlayedAction } from './cardPlayed.action';
import { DiscardAllCardsAction } from './discardAllCards.action';
import { DiscardCardAction } from './discardCard.action';
import { EndturnAction } from './endTurn.action';
import { ExhaustCardAction } from './exhaustCard.action';
import { FullSyncAction } from './fullSync.action';
import { GetCardPilesAction } from './getCardPiles.action';
import { GetEnemiesAction } from './getEnemies.action';
import { GetEnergyAction } from './getEnergy.action';
import { GetPlayerInfoAction } from './getPlayerInfo.action';
import { SetCombatTurnAction } from './setCombatTurn.action';
import { UpdatePlayerEnergyAction } from './updatePlayerEnergy.action';

@Module({
    imports: [
        ExpeditionModule,
        forwardRef(() => ProcessModule),
        EffectModule,
        StatusModule,
        SettingsModule,
        CardModule,
    ],
    providers: [
        FullSyncAction,
        SetCombatTurnAction,
        GetEnergyAction,
        GetCardPilesAction,
        GetEnemiesAction,
        GetPlayerInfoAction,
        CardPlayedAction,
        UpdatePlayerEnergyAction,
        DiscardCardAction,
        DiscardAllCardsAction,
        EndturnAction,
        ExhaustCardAction,
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
        DiscardCardAction,
        DiscardAllCardsAction,
        EndturnAction,
        ExhaustCardAction,
    ],
})
export class ActionModule {}
