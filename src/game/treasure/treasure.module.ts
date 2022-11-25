import { forwardRef, Module } from '@nestjs/common';
import { CardModule } from '../components/card/card.module';
import { ChestModule } from '../components/chest/chest.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PotionModule } from '../components/potion/potion.module';
import { ProcessModule } from '../process/process.module';
import { TreasureService } from './treasure.service';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => CardModule),
        forwardRef(() => ProcessModule),
        PotionModule,
        ChestModule,
    ],
    providers: [TreasureService],
    exports: [TreasureService],
})
export class TreasureModule {}
