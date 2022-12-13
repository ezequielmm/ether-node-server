import { Module } from '@nestjs/common';
import { Expedition } from './expedition.schema';
import { ExpeditionService } from './expedition.service';
import { CardModule } from '../card/card.module';
import { EnemyModule } from '../enemy/enemy.module';
import { PlayerModule } from '../player/player.module';
import { TrinketModule } from '../trinket/trinket.module';
import { KindagooseModule } from 'kindagoose';

@Module({
    imports: [
        KindagooseModule.forFeature([Expedition]),
        CardModule,
        EnemyModule,
        PlayerModule,
        TrinketModule,
    ],
    providers: [ExpeditionService],
    exports: [ExpeditionService, KindagooseModule],
})
export class ExpeditionModule { }
