import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
    ],
    providers: [TrinketService],
    exports: [TrinketService],
})
export class TrinketModule {}
