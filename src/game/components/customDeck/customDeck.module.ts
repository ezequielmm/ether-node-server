import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomDeck, CustomDeckSchema } from './customDeck.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: CustomDeck.name,
                schema: CustomDeckSchema,
            },
        ]),
    ],
})
export class CustomDeckModule {}
