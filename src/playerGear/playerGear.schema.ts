import { ModelOptions, Prop, PropType } from '@typegoose/typegoose';
import { GearItem } from './gearItem';

@ModelOptions({
    schemaOptions: { collection: 'playerGear', versionKey: false },
})
export class PlayerGear {
    @Prop()
    playerId: number;

    @Prop({ type: () => [GearItem] }, PropType.ARRAY)
    gear: GearItem[];
}
