import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Helmet_Helmet_Undead: Gear = {
    gearId: 17,
    name: 'Undead',
    trait: GearTraitEnum.Helmet,
    category: GearCategoryEnum.Helmet,
    rarity: GearRarityEnum.Epic,
};
