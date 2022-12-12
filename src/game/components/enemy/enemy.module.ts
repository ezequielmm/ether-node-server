import { forwardRef, Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { StatusModule } from 'src/game/status/status.module';
import { CombatQueueModule } from '../combatQueue/combatQueue.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { Enemy } from './enemy.schema';
import { EnemyService } from './enemy.service';

@Module({
    imports: [
        KindagooseModule.forFeature([
            Enemy,
        ]),
        forwardRef(() => ExpeditionModule),
        forwardRef(() => StatusModule),
        CombatQueueModule,
    ],
    providers: [EnemyService],
    exports: [EnemyService],
})
export class EnemyModule { }
