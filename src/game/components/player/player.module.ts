import { forwardRef, Module } from '@nestjs/common';
import { AttackQueueModule } from '../attackQueue/attackQueue.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { PlayerService } from './player.service';

@Module({
    imports: [forwardRef(() => ExpeditionModule), AttackQueueModule],
    providers: [PlayerService],
    exports: [PlayerService],
})
export class PlayerModule {}
