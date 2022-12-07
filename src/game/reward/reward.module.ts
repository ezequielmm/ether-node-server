import { forwardRef, Module } from '@nestjs/common';
import { CardModule } from '../components/card/card.module';
import { RewardService } from './reward.service';

@Module({
    imports: [forwardRef(() => CardModule)],
    providers: [RewardService],
    exports: [RewardService],
})
export class RewardModule {}
