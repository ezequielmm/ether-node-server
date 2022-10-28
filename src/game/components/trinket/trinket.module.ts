import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpeditionModule } from '../expedition/expedition.module';
import { Trinket, TrinketSchema } from './trinket.schema';
import { TrinketService } from './trinket.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Trinket.name,
                schema: TrinketSchema,
            },
        ]),
        forwardRef(() => ExpeditionModule),
    ],
    providers: [TrinketService],
    exports: [TrinketService],
})
export class TrinketModule {}
