import { forwardRef, Module } from '@nestjs/common';
import { ChestModule } from '../components/chest/chest.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { ProcessModule } from '../process/process.module';
import { RewardModule } from '../reward/reward.module';
import { TreasureService } from './treasure.service';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => ProcessModule),
        forwardRef(() => RewardModule),
        ChestModule,
    ],
    providers: [TreasureService],
    exports: [TreasureService],
})
export class TreasureModule {}
