import { Prop } from '@typegoose/typegoose';
import {
    GearCategoryEnum,
    GearRarityEnum,
    GearTraitEnum,
} from '../game/components/gear/gear.enum';

/**
 * this class is needed to avoid unique key constraints that would happen if you used the Gear class
 */
export class GearItem {
    @Prop()
    gearId: number;

    @Prop()
    name: string;

    @Prop({ type: String, enum: GearTraitEnum })
    trait: GearTraitEnum;

    @Prop({ type: String, enum: GearCategoryEnum })
    category: GearCategoryEnum;

    @Prop({ type: String, enum: GearRarityEnum })
    rarity: GearRarityEnum;
}
