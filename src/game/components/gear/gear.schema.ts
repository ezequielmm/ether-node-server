import { ModelOptions, Prop, Severity } from '@typegoose/typegoose';
import { GearCategoryEnum, GearRarityEnum, GearTraitEnum } from './gear.enum';

@ModelOptions({
    schemaOptions: { collection: 'gears', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class Gear {
    @Prop({ unique: true })
    gearId: number;

    @Prop()
    name: string;

    @Prop({ type: String, enum: GearTraitEnum })
    trait: GearTraitEnum;

    @Prop({ type: String, enum: GearCategoryEnum })
    category: GearCategoryEnum;

    @Prop({ type: String, enum: GearRarityEnum })
    rarity: GearRarityEnum;

    @Prop({ default: true })
    isActive?: boolean;

    @Prop({ default : false })
    onlyOneAllowed?: boolean;
}
