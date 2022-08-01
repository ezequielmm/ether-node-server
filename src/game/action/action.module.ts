import { forwardRef, Module } from '@nestjs/common';
import { CardModule } from '../components/card/card.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PlayerModule } from '../components/player/player.module';
import { SettingsModule } from '../components/settings/settings.module';
import { EffectModule } from '../effects/effects.module';
import { ProcessModule } from '../process/process.module';
import { StatusModule } from '../status/status.module';
import { CardPlayedAction } from './cardPlayed.action';
import { DiscardAllCardsAction } from './discardAllCards.action';
import { DiscardCardAction } from './discardCard.action';
import { DrawCardAction } from './drawCard.action';
import { ExhaustCardAction } from './exhaustCard.action';
import { FullSyncAction } from './fullSync.action';
import { GetCardPilesAction } from './getCardPiles.action';
import { GetEnemiesAction } from './getEnemies.action';
import { GetEnergyAction } from './getEnergy.action';
import { GetPlayerDeckAction } from './getPlayerDeck.action';
import { GetPlayerInfoAction } from './getPlayerInfo.action';
import { GetStatusesAction } from './getStatuses.action';
import { SetCombatTurnAction } from './setCombatTurn.action';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => ProcessModule),
        forwardRef(() => EffectModule),
        StatusModule,
        SettingsModule,
        CardModule,
        PlayerModule,
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
    ],
})
export class ActionModule {}
