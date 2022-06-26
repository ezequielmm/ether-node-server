import { GameManagerModule } from './../../gameManager/gameManager.module';
import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../../components/expedition/expedition.module';
import { CardModule } from '../../components/card/card.module';
import { CardPlayedAction } from './cardPlayed.action';
import { EndTurnAction } from './endTurn.action';
import { EffectModule } from 'src/game/effects/effect.module';
import { DiscardCardAction } from './discardCard.action';
import { DiscardAllCardsAction } from './discardAllCards.action';
import { ExhaustCardAction } from './exhaustCard.action';
import { TurnChangeAction } from './turnChange.action';
import { UpdatePlayerEnergyAction } from './updatePlayerEnergy.action';
import { GetEnergyAction } from './getEnergy.action';
import { GetCardPilesAction } from './getCardPiles.action';
import { StatusPipelineModule } from 'src/game/status-pipeline/status-pipeline.module';
import { GetEnemiesAction } from './getEnemies.action';
import { GetPlayerInfoAction } from './getPlayerInfo.action';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => CardModule),
        EffectModule,
        GameManagerModule,
        StatusPipelineModule,
    ],
    providers: [
        CardPlayedAction,
        EndTurnAction,
        DiscardCardAction,
        DiscardAllCardsAction,
        ExhaustCardAction,
        TurnChangeAction,
        UpdatePlayerEnergyAction,
        GetEnergyAction,
        GetCardPilesAction,
        GetEnemiesAction,
        GetPlayerInfoAction,
    ],
    exports: [
        CardPlayedAction,
        EndTurnAction,
        DiscardCardAction,
        DiscardAllCardsAction,
        ExhaustCardAction,
        TurnChangeAction,
        UpdatePlayerEnergyAction,
        GetEnergyAction,
        GetCardPilesAction,
        GetEnemiesAction,
        GetPlayerInfoAction,
    ],
})
export class CombatActionModule {}
