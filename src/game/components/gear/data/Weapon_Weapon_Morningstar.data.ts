import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Weapon_Weapon_Morningstar: Gear = {
    gearId: 42,
    name: 'Morningstar',
    trait: GearTraitEnum.Weapon,
    category: GearCategoryEnum.Weapon,
    rarity: GearRarityEnum.Common,
};
