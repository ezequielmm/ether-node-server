import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
    ],
    providers: [EnemyService],
    exports: [EnemyService],
})
export class EnemyModule {}
