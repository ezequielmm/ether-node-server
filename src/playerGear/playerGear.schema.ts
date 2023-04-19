import { ModelOptions, Prop, PropType } from '@typegoose/typegoose';
import { GearItem } from './gearItem';

@ModelOptions({
    schemaOptions: { collection: 'playerGear', versionKey: false },
})
export class PlayerGear {
    @Prop()
    userAddress: string;

    @Prop({ type: () => [GearItem] }, PropType.ARRAY)
    gear: GearItem[];
}
