import { forwardRef, Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { StatusModule } from 'src/game/status/status.module';
import { CombatQueueModule } from '../combatQueue/combatQueue.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { Enemy } from './enemy.schema';
import { EnemyService } from './enemy.service';
import { MapType } from '../expedition/map.schema';
import { ExpeditionService } from '../expedition/expedition.service';
import { Expedition } from '../expedition/expedition.schema';

@Module({
    imports: [
        KindagooseModule.forFeature([Enemy]),
        KindagooseModule.forFeature([MapType]),
        // KindagooseModule.forFeature([Expedition]),

        forwardRef(() => ExpeditionModule),
        forwardRef(() => StatusModule),
        
        CombatQueueModule,
    ],
    providers: [EnemyService],
    exports: [EnemyService, KindagooseModule],
})
export class EnemyModule {}
