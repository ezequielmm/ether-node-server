import { Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { CombatQueue } from './combatQueue.schema';
import { CombatQueueService } from './combatQueue.service';

@Module({
    imports: [KindagooseModule.forFeature([CombatQueue])],
    providers: [CombatQueueService],
    exports: [CombatQueueService],
})
export class CombatQueueModule {}
