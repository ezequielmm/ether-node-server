import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnemyGroup, EnemyGroupSchema } from './enemyGroups.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: EnemyGroup.name,
                schema: EnemyGroupSchema,
            },
        ]),
    ],
})
export class EnemyGroupModule {}
