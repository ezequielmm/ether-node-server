import { forwardRef, Module } from '@nestjs/common';
import { CardModule } from '../components/card/card.module';
import { CombatQueueModule } from '../components/combatQueue/combatQueue.module';
import { EnemyModule } from '../components/enemy/enemy.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PlayerModule } from '../components/player/player.module';
import { PotionModule } from '../components/potion/potion.module';
import { TrinketModule } from '../components/trinket/trinket.module';
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
import { GetMerchantDataAction } from './getMerchantData.action';
import { GetPlayerDeckAction } from './getPlayerDeck.action';
import { GetPlayerInfoAction } from './getPlayerInfo.action';
import { GetStatusesAction } from './getStatuses.action';
import { GetUpgradableCardsAction } from './getUpgradableCards.action';
import { MoveCardToHandAction } from './moveCard.action';
import { SetCombatTurnAction } from './setCombatTurn.action';
import { UpgradeCardAction } from './upgradeCard.action';

const actions = [
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
    MoveCardToHandAction,
    ChangeTurnAction,
    CreateCardAction,
    UpgradeCardAction,
    GetUpgradableCardsAction,
    GetMerchantDataAction,
];

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => ProcessModule),
        forwardRef(() => EffectModule),
        forwardRef(() => StatusModule),
        forwardRef(() => EnemyModule),
        forwardRef(() => CardModule),
        forwardRef(() => PotionModule),
        forwardRef(() => TrinketModule),
        PlayerModule,
        HistoryModule,
        CombatQueueModule,
    ],
    providers: actions,
    exports: actions,
})
export class ActionModule {}
