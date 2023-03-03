import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Weapon_Weapon_Propulsion_Hammer: Gear = {
    gearId: 65,
    name: 'Propulsion Hammer',
    trait: GearTraitEnum.Weapon,
    category: GearCategoryEnum.Weapon,
    rarity: GearRarityEnum.Epic,
};
