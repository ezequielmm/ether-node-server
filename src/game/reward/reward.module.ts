import { forwardRef, Module } from '@nestjs/common';
import { CardModule } from '../components/card/card.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { PotionModule } from '../components/potion/potion.module';
import { TrinketModule } from '../components/trinket/trinket.module';
import { RewardService } from './reward.service';

@Module({
    imports: [
        forwardRef(() => CardModule),
        forwardRef(() => ExpeditionModule),
        forwardRef(() => PotionModule),
        forwardRef(() => TrinketModule),
    ],
    providers: [RewardService],
    exports: [RewardService],
})
export class RewardModule {}
