import { forwardRef, Module } from '@nestjs/common';

import { MerchantService } from './merchant.service';

import { TrinketModule } from '../components/trinket/trinket.module';
import { CardModule } from '../components/card/card.module';
import { PotionModule } from '../components/potion/potion.module';
import { ExpeditionModule } from '../components/expedition/expedition.module';

@Module({
    imports: [
        forwardRef(() => ExpeditionModule),
        forwardRef(() => CardModule),
        forwardRef(() => PotionModule),
        forwardRef(() => TrinketModule),
    ],

    providers: [MerchantService],
    exports: [MerchantService],
})
export class MerchantModule {}
