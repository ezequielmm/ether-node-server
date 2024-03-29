import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Gauntlet_Gauntlets_Pleather: Gear = {
    gearId: 512,
    name: 'Pleather Gloves',
    trait: GearTraitEnum.Gauntlet,
    category: GearCategoryEnum.Gauntlets,
    rarity: GearRarityEnum.Uncommon,
    onlyOneAllowed: true,
};
