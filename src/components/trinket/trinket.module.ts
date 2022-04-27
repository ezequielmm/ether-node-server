import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trinket, TrinketSchema } from './trinket.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Trinket.name,
                schema: TrinketSchema,
            },
        ]),
    ],
})
export class TrinketModule {}
