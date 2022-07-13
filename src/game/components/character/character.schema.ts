import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CharacterClassEnum } from './character.enum';
import { CharacterDeckSettings } from './character.interface';

export type CharacterDocument = Character & Document;

@Schema()
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
    deckSettings: CharacterDeckSettings;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
