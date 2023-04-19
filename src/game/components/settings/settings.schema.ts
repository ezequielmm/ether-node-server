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

    @Prop()
    healPercentageInCamp: number;

    @Prop()
    maxSteps: number;

    @Prop()
    maxNodes: number;

    @Prop()
    maxCardsOnMerchantNode: number;

    @Prop()
    maxPotionsOnMerchantNode: number;

    @Prop()
    maxTrinketsOnMerchantNode: number;

    @Prop()
    minLootboxSize: number;

    @Prop()
    maxLootboxSize: number;
}
