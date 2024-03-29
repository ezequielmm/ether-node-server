import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Pauldrons_Pauldrons_Immunity: Gear = {
    gearId: 518,
    name: 'Pauldrons of Immunity',
    trait: GearTraitEnum.Pauldrons,
    category: GearCategoryEnum.Pauldrons,
    rarity: GearRarityEnum.Legendary,
    onlyOneAllowed: true,
};
