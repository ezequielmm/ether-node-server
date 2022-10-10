import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EffectModule } from 'src/game/effects/effects.module';
import { ExpeditionModule } from '../expedition/expedition.module';
import { PlayerModule } from '../player/player.module';
import { PotionGateway } from './potion.gateway';
import { Potion, PotionSchema } from './potion.schema';
import { PotionService } from './potion.service';

@Module({
    imports: [
        ExpeditionModule,
        EffectModule,
        PlayerModule,
        MongooseModule.forFeature([
            {
                name: Potion.name,
                schema: PotionSchema,
            },
        ]),
    ],
    providers: [PotionService, PotionGateway],
    exports: [PotionService],
})
export class PotionModule {}
