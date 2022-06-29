import { CardTargetedEnum } from '../components/card/card.enum';
import { EffectName } from './effects.enum';
import { TargetId } from './effects.types';

export interface BaseEffectDTO {
    readonly clientId: string;
    readonly targetId: TargetId;
}

export interface IBaseEffect {
    handle: (...args: BaseEffectDTO[]) => Promise<any>;
}

export interface JsonEffect {
    name: EffectName;
    args: {
        baseValue: number;
        calculatedValue: number;
        targeted: CardTargetedEnum;
        times: number;
    };
}

export interface DamageDTO extends BaseEffectDTO {
    calculatedValue: number;
    times: number;
    targeted: CardTargetedEnum;
    targetId: TargetId;
}
