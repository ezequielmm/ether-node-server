import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Padding_Padding_Flannel: Gear = {
    gearId: 501,
    name: 'Flannel Padding',
    trait: GearTraitEnum.Padding,
    category: GearCategoryEnum.Padding,
    rarity: GearRarityEnum.Epic,
    onlyOneAllowed: true,
};
