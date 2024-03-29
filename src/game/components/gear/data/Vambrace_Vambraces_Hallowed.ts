import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Vambrace_Vambraces_Hallowed: Gear = {
    gearId: 504,
    name: 'Hallowed Vambraces',
    trait: GearTraitEnum.Vambrace,
    category: GearCategoryEnum.Vambraces,
    rarity: GearRarityEnum.Common,
    onlyOneAllowed: true,
};
