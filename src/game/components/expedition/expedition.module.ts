import { Module } from '@nestjs/common';
import { Expedition } from './expedition.schema';
import { ExpeditionService } from './expedition.service';
import { CardModule } from '../card/card.module';
import { EnemyModule } from '../enemy/enemy.module';
import { PlayerModule } from '../player/player.module';
import { KindagooseModule } from 'kindagoose';
import { TrinketModule } from '../trinket/trinket.module';
import { MapModule } from 'src/game/map/map/map.module';

@Module({
    imports: [
        KindagooseModule.forFeature([Expedition]),
        CardModule,
        EnemyModule,
        PlayerModule,
        TrinketModule,
        MapModule,
    ],
    providers: [ExpeditionService],
    exports: [ExpeditionService, KindagooseModule],
})
export class ExpeditionModule {}
