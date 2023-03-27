import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Shield_Shield_Aegis: Gear = {
    gearId: 30,
    name: 'Aegis',
    trait: GearTraitEnum.Shield,
    category: GearCategoryEnum.Shield,
    rarity: GearRarityEnum.Uncommon,
};
