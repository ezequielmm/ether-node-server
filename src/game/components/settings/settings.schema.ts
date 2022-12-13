import { ModelOptions, Prop } from '@typegoose/typegoose';

@ModelOptions({
    schemaOptions: { collection: 'settings', versionKey: false },
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
