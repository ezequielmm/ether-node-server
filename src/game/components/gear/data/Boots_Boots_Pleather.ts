import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Boots_Boots_Pleather: Gear = {
    gearId: 511,
    name: 'Pleather Boots',
    trait: GearTraitEnum.Boots,
    category: GearCategoryEnum.Boots,
    rarity: GearRarityEnum.Uncommon,
    onlyOneAllowed: true,
};
