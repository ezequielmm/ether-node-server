import { forwardRef, Module } from '@nestjs/common';
import { ExpeditionModule } from 'src/game/components/expedition/expedition.module';
import { CombatActionModule } from '../actions/combat.action.module';
import { InitCombatProcess } from './initCombat.process';

@Module({
    imports: [forwardRef(() => ExpeditionModule), CombatActionModule],
    providers: [InitCombatProcess],
    exports: [InitCombatProcess],
})
export class CombatProcessModule {}
