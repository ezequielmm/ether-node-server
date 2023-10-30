import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Weapon_Weapon_Carving_Knife: Gear = {
    gearId: 509,
    name: 'Carving Knife',
    trait: GearTraitEnum.Weapon,
    category: GearCategoryEnum.Weapon,
    rarity: GearRarityEnum.Legendary,
    onlyOneAllowed: true,
};
