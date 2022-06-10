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

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => CardModule),
        EffectModule,
        GameManagerModule,
    ],
    providers: [
        CardPlayedAction,
        EndTurnAction,
        DiscardCardAction,
        DiscardAllCardsAction,
        ExhaustCardAction,
        TurnChangeAction,
        UpdatePlayerEnergyAction,
    ],
    exports: [
        CardPlayedAction,
        EndTurnAction,
        DiscardCardAction,
        DiscardAllCardsAction,
        ExhaustCardAction,
        TurnChangeAction,
        UpdatePlayerEnergyAction,
    ],
})
export class CombatActionModule {}
