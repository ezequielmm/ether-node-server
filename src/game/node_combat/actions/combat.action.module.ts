import { GameManagerModule } from './../../gameManager/gameManager.module';
import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../../expedition/expedition.module';
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
import { GetPlayerHealthAction } from './getPlayerHealth.action';
import { GetCardPilesAction } from './getCardPiles.action';
import { StatusPipelineModule } from 'src/game/status-pipeline/status-pipeline.module';

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
        GetPlayerHealthAction,
        GetCardPilesAction,
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
        GetPlayerHealthAction,
        GetCardPilesAction,
    ],
})
export class CombatActionModule {}
