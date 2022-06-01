import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Potion, PotionSchema } from './potion.schema';
import { PotionService } from './potion.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Potion.name,
                schema: PotionSchema,
            },
        ]),
    ],
    providers: [PotionService],
})
export class PotionModule {}
