import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Weapon_Weapon_Flail: Gear = {
    gearId: 41,
    name: 'Flail',
    trait: GearTraitEnum.Weapon,
    category: GearCategoryEnum.Weapon,
    rarity: GearRarityEnum.Common,
};
