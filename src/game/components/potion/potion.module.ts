import { forwardRef, Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { ActionQueueModule } from 'src/actionQueue/actionQueue.module';
import { ActionModule } from 'src/game/action/action.module';
import { EffectModule } from 'src/game/effects/effects.module';
import { CombatQueueModule } from '../combatQueue/combatQueue.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { PlayerModule } from '../player/player.module';
import { PotionGateway } from './potion.gateway';
import { Potion } from './potion.schema';
import { PotionService } from './potion.service';

@Module({
    imports: [
        KindagooseModule.forFeature([Potion]),
        forwardRef(() => ExpeditionModule),
        forwardRef(() => EffectModule),
        forwardRef(() => ActionModule),
        PlayerModule,
        CombatQueueModule,
        ActionQueueModule,
    ],
    providers: [PotionService, PotionGateway],
    exports: [PotionService],
})
export class PotionModule {}
