import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CombatQueueModule } from '../combatQueue/combatQueue.module';
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
        CombatQueueModule,
    ],
    providers: [EnemyService],
    exports: [EnemyService],
})
export class EnemyModule {}
