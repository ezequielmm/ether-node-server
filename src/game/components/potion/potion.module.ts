import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Potion, PotionSchema } from './potion.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Potion.name,
                schema: PotionSchema,
            },
        ]),
    ],
})
export class PotionModule {}
