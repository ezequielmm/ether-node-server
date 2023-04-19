import { Prop } from '@typegoose/typegoose';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { StatusDirection, StatusType } from 'src/game/status/interfaces';
import { Trinket } from './trinket.schema';

export class TrinketModifier extends Trinket {
    @Prop()
    direction: StatusDirection;

    @Prop()
    type: StatusType;

    @Prop()
    effect: string;

    mutate(_value: EffectDTO): Promise<EffectDTO> | EffectDTO {
        throw new Error('Method not implemented.');
    }

    public static isModifier(trinket: Trinket): trinket is TrinketModifier {
        return typeof (trinket as TrinketModifier).mutate !== 'undefined';
    }
}
