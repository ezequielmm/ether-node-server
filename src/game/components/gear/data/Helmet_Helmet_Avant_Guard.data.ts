import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Helmet_Helmet_Avant_Guard: Gear = {
    gearId: 10,
    name: 'Avant Guard',
    trait: GearTraitEnum.Helmet,
    category: GearCategoryEnum.Helmet,
    rarity: GearRarityEnum.Uncommon,
};
