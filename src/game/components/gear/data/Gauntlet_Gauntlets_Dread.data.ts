import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Gauntlet_Gauntlets_Dread: Gear = {
    gearId: 123,
    name: 'Dread',
    trait: GearTraitEnum.Gauntlet,
    category: GearCategoryEnum.Gauntlets,
    rarity: GearRarityEnum.Rare,
};
