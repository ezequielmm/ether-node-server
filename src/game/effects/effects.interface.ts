import { CardTargetedEnum } from '../components/card/card.enum';
import { EffectName } from './effects.enum';
import { TargetId } from './effects.types';

export interface BaseEffectDTO {
    readonly client_id: string;
    readonly targetedId?: TargetId;
}

export interface IBaseEffect {
    handle: (...args: BaseEffectDTO[]) => Promise<any>;
}

export interface JsonEffect {
    name: EffectName;
    args: {
        base_value: number;
        calculated_value: number;
        targeted: CardTargetedEnum;
        times: number;
    };
}
