import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Helmet_Helmet_Great_Helm: Gear = {
    gearId: 5,
    name: 'Great Helm',
    trait: GearTraitEnum.Helmet,
    category: GearCategoryEnum.Helmet,
    rarity: GearRarityEnum.Common,
};
