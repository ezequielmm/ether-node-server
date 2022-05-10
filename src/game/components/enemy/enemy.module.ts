import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Enemy, EnemySchema } from './enemy.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Enemy.name,
                schema: EnemySchema,
            },
        ]),
    ],
})
export class EnemyModule {}
