import { ModelOptions, Prop, Severity } from '@typegoose/typegoose';
import { CharacterClassEnum } from './character.enum';

@ModelOptions({
    schemaOptions: { collection: 'characters', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class Character {
    @Prop()
    name: string;

    @Prop()
    contractId: string;

    @Prop()
    contractIdTest: string;

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

    @Prop({ type: Object })
    lootboxRarity: {
        common: number;
        uncommon: number;
        rare: number;
        epic: number;
        legendary: number;
    };
}
