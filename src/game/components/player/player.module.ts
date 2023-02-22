import { forwardRef, Module } from '@nestjs/common';
import { HistoryModule } from 'src/game/history/history.module';
import { StatusModule } from 'src/game/status/status.module';
import { CombatQueueModule } from '../combatQueue/combatQueue.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { PlayerService } from './player.service';

@Module({
    imports: [
        CombatQueueModule,
        forwardRef(() => ExpeditionModule),
        forwardRef(() => StatusModule),
        HistoryModule,
    ],
    providers: [PlayerService],
    exports: [PlayerService],
})
export class PlayerModule {}
