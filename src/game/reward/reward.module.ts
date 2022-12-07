import { forwardRef, Module } from '@nestjs/common';
import { CardModule } from '../components/card/card.module';
import { PotionModule } from '../components/potion/potion.module';
import { RewardService } from './reward.service';

@Module({
    imports: [forwardRef(() => CardModule), PotionModule],
    providers: [RewardService],
    exports: [RewardService],
})
export class RewardModule {}
