import { forwardRef, Module } from '@nestjs/common';
import { CombatQueueModule } from '../combatQueue/combatQueue.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { PlayerService } from './player.service';

@Module({
    imports: [forwardRef(() => ExpeditionModule), , CombatQueueModule],
    providers: [PlayerService],
    exports: [PlayerService],
})
export class PlayerModule {}
