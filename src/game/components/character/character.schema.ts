import { ModelOptions, Prop } from '@typegoose/typegoose';
import { HydratedDocument } from 'mongoose';
import { CharacterClassEnum } from './character.enum';

export type CharacterDocument = HydratedDocument<Character>;

@ModelOptions({
    schemaOptions: { collection: 'characters', versionKey: false },
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

    @Prop({ type: String, enum: CharacterClassEnum })
    characterClass: CharacterClassEnum;

    @Prop({ type: Object })
    cards: {
        cardId: number;
        amount: number;
    }[];

    @Prop()
    isActive: boolean;
}
