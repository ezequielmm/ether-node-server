import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CharacterClassEnum } from './character.enum';

export type CharacterDocument = Character & Document;

@Schema({
    collection: 'characters',
})
export class Character {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    initialHealth: number;

    @Prop()
    initialGold: number;

    @Prop()
    characterClass: CharacterClassEnum;

    @Prop({ type: Object })
    cards: {
        cardId: number;
        amount: number;
    }[];
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
