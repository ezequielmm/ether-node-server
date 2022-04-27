import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './card.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Card.name,
                schema: CardSchema,
            },
        ]),
    ],
})
export class CardModule {}
