import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Helmet_Helmet_Hood: Gear = {
    gearId: 22,
    name: 'Hood',
    trait: GearTraitEnum.Helmet,
    category: GearCategoryEnum.Helmet,
    rarity: GearRarityEnum.Legendary,
};
