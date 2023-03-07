import { Prop } from '@typegoose/typegoose';
import {
    GearCategoryEnum,
    GearRarityEnum,
    GearTraitEnum,
} from '../game/components/gear/gear.enum';

export class GearItem {
    gearId: number;

    name: string;

    trait: GearTraitEnum;

    category: GearCategoryEnum;

    rarity: GearRarityEnum;
}
