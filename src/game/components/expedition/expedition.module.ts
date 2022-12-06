import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Expedition, ExpeditionSchema } from './expedition.schema';
import { ExpeditionService } from './expedition.service';
import { CardModule } from '../card/card.module';
import { EnemyModule } from '../enemy/enemy.module';
import { PlayerModule } from '../player/player.module';
import { TrinketModule } from '../trinket/trinket.module';

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
        PlayerModule,
        TrinketModule,
    ],
    providers: [ExpeditionService],
    exports: [ExpeditionService, MongooseModule],
})
export class ExpeditionModule {}
