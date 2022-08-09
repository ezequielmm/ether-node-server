import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttackQueueModule } from '../attackQueue/attackQueue.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { Enemy, EnemySchema } from './enemy.schema';
import { EnemyService } from './enemy.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Enemy.name,
                schema: EnemySchema,
            },
        ]),
        forwardRef(() => ExpeditionModule),
        AttackQueueModule,
    ],
    providers: [EnemyService],
    exports: [EnemyService],
})
export class EnemyModule {}
