import { GameManagerModule } from './../../gameManger/gameManager.module';
import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../../expedition/expedition.module';
import { CardModule } from '../../components/card/card.module';
import { CardPlayedAction } from './cardPlayed.action';
import { EndTurnAction } from './endTurn.action';
import { EffectModule } from 'src/game/effects/effect.module';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => CardModule),
        EffectModule,
        GameManagerModule,
    ],
    providers: [CardPlayedAction, EndTurnAction],
    exports: [CardPlayedAction, EndTurnAction, ExpeditionModule],
})
export class CombatActionModule {}
