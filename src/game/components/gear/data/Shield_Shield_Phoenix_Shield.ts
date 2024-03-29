import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Shield_Shield_Phoenix_Shield: Gear = {
    gearId: 516,
    name: 'Phoenix Shield',
    trait: GearTraitEnum.Shield,
    category: GearCategoryEnum.Shield,
    rarity: GearRarityEnum.Epic,
    onlyOneAllowed: true,
};