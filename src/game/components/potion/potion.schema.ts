import { ModelOptions, Prop, Severity } from '@typegoose/typegoose';
import { JsonEffect } from 'src/game/effects/effects.interface';
import { PotionRarityEnum } from './potion.enum';

@ModelOptions({
    schemaOptions: { collection: 'potions', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class Potion {
    @Prop()
    potionId: number;

    @Prop()
    name: string;

    @Prop({ type: String, enum: PotionRarityEnum })
    rarity: PotionRarityEnum;

    @Prop()
    description: string;

    @Prop()
    effects: JsonEffect[];

    @Prop()
    usableOutsideCombat: boolean;

    @Prop({ default: false })
    showPointer: boolean;

    @Prop()
    isActive: boolean;
}
