import { ModelOptions, Prop, PropType } from '@typegoose/typegoose';
import { Gear } from '../game/components/gear/gear.schema';
import { GearItem } from './gearItem';

@ModelOptions({
    schemaOptions: { collection: 'playerGear', versionKey: false },
})
export class PlayerGear {
    @Prop()
    playerId: string;

    @Prop({ type: () => [Gear] }, PropType.ARRAY)
    gear: GearItem[];
}

