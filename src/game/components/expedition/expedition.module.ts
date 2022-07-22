import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Expedition, ExpeditionSchema } from './expedition.schema';
import { ExpeditionService } from './expedition.service';
import { CardModule } from '../card/card.module';
import { EnemyModule } from '../enemy/enemy.module';
import { EffectModule } from 'src/game/effects/effects.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Expedition.name,
                schema: ExpeditionSchema,
            },
        ]),
        CardModule,
        EnemyModule,
        forwardRef(() => EffectModule),
    ],
    providers: [ExpeditionService],
    exports: [ExpeditionService, MongooseModule],
})
export class ExpeditionModule {}
