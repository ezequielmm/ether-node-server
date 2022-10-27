import { forwardRef, Module } from '@nestjs/common';
import { CardModule } from '../components/card/card.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PotionModule } from '../components/potion/potion.module';
import { TrinketModule } from '../components/trinket/trinket.module';
import { ProcessModule } from '../process/process.module';
import { TreasureService } from './treasure.service';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => CardModule),
        forwardRef(() => ProcessModule),
        PotionModule,
        TrinketModule,
    ],
    providers: [TreasureService],
    exports: [TreasureService],
})
export class TreasureModule {}
