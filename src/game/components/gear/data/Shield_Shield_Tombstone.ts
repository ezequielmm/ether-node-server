
import { Gear } from '../gear.schema';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from '../gear.enum';

export const Shield_Shield_Tombstone: Gear = {
    gearId: 502,
    name: 'Tombstone Shield',
    trait: GearTraitEnum.Shield,
    category: GearCategoryEnum.Shield,
    rarity: GearRarityEnum.Uncommon,
    onlyOneAllowed: true,
};
