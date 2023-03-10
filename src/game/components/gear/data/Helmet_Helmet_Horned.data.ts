import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Helmet_Helmet_Horned: Gear = {
    gearId: 12,
    name: 'Horned',
    trait: GearTraitEnum.Helmet,
    category: GearCategoryEnum.Helmet,
    rarity: GearRarityEnum.Rare,
};
