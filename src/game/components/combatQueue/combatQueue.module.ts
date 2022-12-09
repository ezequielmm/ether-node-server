import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CombatQueue } from './combatQueue.schema';
import { CombatQueueService } from './combatQueue.service';

@Module({
    imports: [
        TypegooseModule.forFeature([
            CombatQueue,
        ]),
    ],
    providers: [CombatQueueService],
    exports: [CombatQueueService],
})
export class CombatQueueModule { }
