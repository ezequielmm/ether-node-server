import { forwardRef, Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { EncounterService } from './encounter.service';
import { ExpeditionModule } from '../expedition/expedition.module';
import { Encounter } from './encounter.schema';
import { CardModule } from '../card/card.module';
import { TrinketModule } from '../trinket/trinket.module';
import { PotionModule } from '../potion/potion.module';
import { PlayerModule } from '../player/player.module';

@Module({
    imports: [
        KindagooseModule.forFeature([Encounter]),
        forwardRef(() => ExpeditionModule),
        forwardRef(() => CardModule),
        forwardRef(() => TrinketModule),
        forwardRef(() => PotionModule),
        forwardRef(() => PlayerModule),
    ],
    providers: [EncounterService],
    exports: [EncounterService, KindagooseModule],
})
export class EncounterModule {}
