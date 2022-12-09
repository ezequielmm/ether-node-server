import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
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
        forwardRef(() => ExpeditionModule),
        EffectModule,
        PlayerModule,
        TypegooseModule.forFeature([
          Potion
        ]),
        forwardRef(() => ActionModule),
        CombatQueueModule,
    ],
    providers: [PotionService, PotionGateway],
    exports: [PotionService],
})
export class PotionModule {}
