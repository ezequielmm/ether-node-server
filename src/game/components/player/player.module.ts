import { Module } from '@nestjs/common';
import { ExpeditionModule } from '../expedition/expedition.module';
import { PlayerService } from './player.service';

@Module({
    imports: [ExpeditionModule],
    providers: [PlayerService],
    exports: [PlayerService],
})
export class PlayerModule {}
