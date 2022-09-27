import { forwardRef, Module } from '@nestjs/common';
import { CardModule } from '../components/card/card.module';
import { CombatQueueModule } from '../components/combatQueue/combatQueue.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PlayerModule } from '../components/player/player.module';
import { EffectModule } from '../effects/effects.module';
import { HistoryModule } from '../history/history.module';
import { ProcessModule } from '../process/process.module';
import { StatusModule } from '../status/status.module';
import { CardPlayedAction } from './cardPlayed.action';
import { ChangeTurnAction } from './changeTurn.action';
import { CreateCardAction } from './createCard.action';
import { DiscardAllCardsAction } from './discardAllCards.action';
import { DiscardCardAction } from './discardCard.action';
import { DrawCardAction } from './drawCard.action';
import { ExhaustCardAction } from './exhaustCard.action';
import { FullSyncAction } from './fullSync.action';
import { GetCardPilesAction } from './getCardPiles.action';
import { GetCurrentStepAction } from './getCurrentStep.action';
import { GetEnemiesAction } from './getEnemies.action';
import { GetEnergyAction } from './getEnergy.action';
import { GetPlayerDeckAction } from './getPlayerDeck.action';
import { GetPlayerInfoAction } from './getPlayerInfo.action';
import { GetStatusesAction } from './getStatuses.action';
import { MoveCardAction } from './moveCard.action';
import { SetCombatTurnAction } from './setCombatTurn.action';
import { UpgradeCardAction } from './upgradeCard.action';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => ProcessModule),
        forwardRef(() => EffectModule),
        forwardRef(() => StatusModule),
        forwardRef(() => EnemyModule),
        forwardRef(() => CardModule),
        PlayerModule,
        HistoryModule,
        CombatQueueModule,
    ],
    providers: [
        FullSyncAction,
        SetCombatTurnAction,
        GetEnergyAction,
        GetCardPilesAction,
        GetEnemiesAction,
        GetPlayerInfoAction,
        CardPlayedAction,
        DiscardCardAction,
        DiscardAllCardsAction,
        ExhaustCardAction,
        GetStatusesAction,
        DrawCardAction,
        GetPlayerDeckAction,
        GetCurrentStepAction,
        MoveCardAction,
        ChangeTurnAction,
        CreateCardAction,
        UpgradeCardAction,
    ],
    exports: [
        FullSyncAction,
        SetCombatTurnAction,
        GetEnergyAction,
        GetCardPilesAction,
        GetEnemiesAction,
        GetPlayerInfoAction,
        CardPlayedAction,
        DiscardCardAction,
        DiscardAllCardsAction,
        ExhaustCardAction,
        GetStatusesAction,
        DrawCardAction,
        GetPlayerDeckAction,
        GetCurrentStepAction,
        MoveCardAction,
        ChangeTurnAction,
        CreateCardAction,
        UpgradeCardAction,
    ],
})
export class ActionModule {}
