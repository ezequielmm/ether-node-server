import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CombatQueue, CombatQueueSchema } from './combatQueue.schema';
import { CombatQueueService } from './combatQueue.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: CombatQueue.name,
                schema: CombatQueueSchema,
            },
        ]),
    ],
    providers: [CombatQueueService],
    exports: [CombatQueueService],
})
export class CombatQueueModule {}
