import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomDeckDocument = HydratedDocument<CustomDeck>;

@Schema({
    collection: 'customDecks',
    versionKey: false,
})
export class CustomDeck {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop({ type: Object })
    cards: {
        cardId: number;
        amount: number;
    }[];

    @Prop()
    isDefault: boolean;
}

export const CustomDeckSchema = SchemaFactory.createForClass(CustomDeck);
