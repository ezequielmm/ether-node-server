import { forwardRef, Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { ExpeditionModule } from '../expedition/expedition.module';
import { CorncobPipeUpgradedTrinket } from './collection/corncob-pipe-upgraded.trinket';
import { CorncobPipeTrinket } from './collection/corncob-pipe.trinket';
import { Trinket } from './trinket.schema';
import { TrinketService } from './trinket.service';

@Module({
    imports: [
        KindagooseModule.forFeature([
            {
                schema: Trinket,
                discriminators: [
                    CorncobPipeTrinket,
                    CorncobPipeUpgradedTrinket,
                ],
            },
        ]),
        forwardRef(() => ExpeditionModule),
    ],
    providers: [TrinketService],
    exports: [TrinketService, KindagooseModule],
})
export class TrinketModule {}
