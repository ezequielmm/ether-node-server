import { ModelOptions, Prop } from '@typegoose/typegoose';
import { CharacterClassEnum } from './character.enum';

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
