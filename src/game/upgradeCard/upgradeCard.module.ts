import { Module } from '@nestjs/common';
import { CardModule } from '../components/card/card.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';
import { UpgradeCardService } from './upgradeCard.service';

@Module({
    imports: [ExpeditionModule, CardModule],
    providers: [UpgradeCardService],
    exports: [UpgradeCardService],
})
export class UpgradeCardModule {}
