import { Module } from '@nestjs/common';
import { Expedition } from './expedition.schema';
import { ExpeditionService } from './expedition.service';
import { CardModule } from '../card/card.module';
import { EnemyModule } from '../enemy/enemy.module';
import { PlayerModule } from '../player/player.module';
import { TrinketModule } from '../trinket/trinket.module';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
    imports: [
        TypegooseModule.forFeature([Expedition]),
        CardModule,
        EnemyModule,
        PlayerModule,
        TrinketModule,
    ],
    providers: [ExpeditionService],
    exports: [ExpeditionService, TypegooseModule],
})
export class ExpeditionModule {}
