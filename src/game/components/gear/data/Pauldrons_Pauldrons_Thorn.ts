import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Pauldrons_Pauldrons_Thorn: Gear = {
    gearId: 503,
    name: 'Thorn Pauldrons',
    trait: GearTraitEnum.Pauldrons,
    category: GearCategoryEnum.Pauldrons,
    rarity: GearRarityEnum.Uncommon,
    onlyOneAllowed: true,
};