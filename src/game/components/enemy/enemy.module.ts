import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
    ],
    providers: [EnemyService],
    exports: [EnemyService],
})
export class EnemyModule {}
