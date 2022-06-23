import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from 'src/game/components/expedition/expedition.module';
import { CombatActionModule } from '../actions/combat.action.module';
import { InitCombatProcess } from './initCombat.process';
import { SendEnemyIntentProcess } from './sendEnemyIntent.process';

@Module({
    imports: [forwardRef(() => ExpeditionModule), CombatActionModule],
    providers: [InitCombatProcess, SendEnemyIntentProcess],
    exports: [InitCombatProcess, SendEnemyIntentProcess],
})
export class CombatProcessModule {}
