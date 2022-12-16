import { forwardRef, Module } from '@nestjs/common';
import { KindagooseModule } from 'kindagoose';
import { ExpeditionModule } from '../expedition/expedition.module';
import { Trinket } from './trinket.schema';
import { TrinketService } from './trinket.service';
import * as Trinkets from '../trinket/collection';

@Module({
    imports: [
        KindagooseModule.forFeature([
            {
                schema: Trinket,
                discriminators: Object.values(Trinkets),
            },
        ]),
        forwardRef(() => ExpeditionModule),
    ],
    providers: [TrinketService],
    exports: [TrinketService, KindagooseModule],
})
export class TrinketModule {}
