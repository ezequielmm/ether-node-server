import { ModelOptions, Prop, Severity } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: { collection: 'settings', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class Settings {
    @Prop()
    initialEnergy: number;

    @Prop()
    maxEnergy: number;

    @Prop()
    initialHandPileSize: number;

    @Prop()
    initialDeckSize: number;

    @Prop()
    initialPotionChance: number;

    @Prop()
    maxCardRewardsInCombat: number;
}
