import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Shield_Shield_Triangle: Gear = {
    gearId: 25,
    name: 'Triangle',
    trait: GearTraitEnum.Shield,
    category: GearCategoryEnum.Shield,
    rarity: GearRarityEnum.Common,
};
