import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from '../../expedition/expedition.module';
import { CardModule } from '../../components/card/card.module';
import { CardPlayedAction } from './cardPlayed.action';
import { EndTurnAction } from './endTurn.action';

@Module({
    imports: [forwardRef(() => ExpeditionModule), forwardRef(() => CardModule)],
    providers: [CardPlayedAction, EndTurnAction],
    exports: [CardPlayedAction, EndTurnAction],
})
export class CombatActionModule {}
