import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Breastplate_Breastplate_The_Devourer: Gear = {
    gearId: 500,
    name: 'The Devourer',
    trait: GearTraitEnum.Breastplate,
    category: GearCategoryEnum.Breastplate,
    rarity: GearRarityEnum.Legendary,
    onlyOneAllowed: true,
};
