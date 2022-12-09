import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { StatusModule } from 'src/game/status/status.module';
import { CombatQueueModule } from '../combatQueue/combatQueue.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { Enemy} from './enemy.schema';
import { EnemyService } from './enemy.service';

@Module({
    imports: [
        TypegooseModule.forFeature([
            Enemy,
        ]),
        forwardRef(() => ExpeditionModule),
        forwardRef(() => StatusModule),
        CombatQueueModule,
    ],
    providers: [EnemyService],
    exports: [EnemyService],
})
export class EnemyModule {}
