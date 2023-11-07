import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Legguard_Legguard_Plaguards: Gear = {
    gearId: 517,
    name: 'Plagguard',
    trait: GearTraitEnum.Legguard,
    category: GearCategoryEnum.Legguard,
    rarity: GearRarityEnum.Legendary,
    onlyOneAllowed: true,
};
