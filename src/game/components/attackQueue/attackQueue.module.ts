import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttackQueue, AttackQueueSchema } from './attackQueue.schema';
import { AttackQueueService } from './attackQueue.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: AttackQueue.name,
                schema: AttackQueueSchema,
            },
        ]),
    ],
    providers: [AttackQueueService],
    exports: [AttackQueueService],
})
export class AttackQueueModule {}
