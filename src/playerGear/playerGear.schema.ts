import { ModelOptions, Prop, PropType } from '@typegoose/typegoose';
import { Gear } from '../game/components/gear/gear.schema';

@ModelOptions({
    schemaOptions: { collection: 'playerGear', versionKey: false },
})
export class PlayerGear {
    @Prop()
    playerId: string;

    @Prop({ type: () => [Gear] }, PropType.ARRAY)
    gear: Gear[];
}
