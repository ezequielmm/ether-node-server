import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomDeckDocument = CustomDeck & Document;

@Schema({
    collection: 'customDecks',
})
export class CustomDeck {
    @Prop()
    name: string;

    @Prop({ type: Object })
    cards: {
        cardId: number;
        amount: number;
    }[];

    @Prop()
    isDefault: boolean;
}

export const CustomDeckSchema = SchemaFactory.createForClass(CustomDeck);
