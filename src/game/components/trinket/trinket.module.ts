import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpeditionModule } from '../expedition/expedition.module';
import {
    PeacockFeatherTrinket,
    PeacockFeatherTrinketSchema,
} from './collection/peacock-feather.trinket';
import { Trinket, TrinketSchema } from './trinket.schema';
import { TrinketService } from './trinket.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Trinket.name,
                schema: TrinketSchema,
                discriminators: [
                    {
                        name: PeacockFeatherTrinket.name,
                        schema: PeacockFeatherTrinketSchema,
                    },
                ],
            },
        ]),
        forwardRef(() => ExpeditionModule),
    ],
    providers: [TrinketService],
    exports: [TrinketService, MongooseModule],
})
export class TrinketModule {}
