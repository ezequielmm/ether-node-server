import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomDeck, CustomDeckSchema } from './customDeck.schema';
import { CustomDeckService } from './customDeck.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: CustomDeck.name,
                schema: CustomDeckSchema,
            },
        ]),
    ],
    providers: [CustomDeckService],
    exports: [CustomDeckService],
})
export class CustomDeckModule {}
