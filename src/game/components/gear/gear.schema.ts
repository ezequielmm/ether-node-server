import { ModelOptions, Prop, Severity } from '@typegoose/typegoose';
import { GearRarityEnum } from './gear.enum';

@ModelOptions({
    schemaOptions: { collection: 'gears', versionKey: false },
    options: { allowMixed: Severity.ALLOW },
})
export class Gear {
    @Prop({ unique: true })
    gearId: number;

    @Prop()
    name: string;

    @Prop({ type: String, enum: GearRarityEnum })
    rarity: GearRarityEnum;
}
