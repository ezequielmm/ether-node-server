import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomDeckDocument = CustomDeck & Document;

@Schema()
export class CustomDeck {
    @Prop()
    name: string;

    @Prop()
    cards: number[];
}

export const CustomDeckSchema = SchemaFactory.createForClass(CustomDeck);
