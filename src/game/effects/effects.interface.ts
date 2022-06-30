import { CardTargetedEnum } from '../components/card/card.enum';
import { EffectName } from './effects.enum';
import { TargetId } from './effects.types';

export interface BaseEffectDTO {
    readonly clientId: string;
    readonly targetId: TargetId;
    calculatedValue: number;
    times: number;
    targeted: CardTargetedEnum;
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

export type DamageDTO = BaseEffectDTO;
export type DrawCardDTO = BaseEffectDTO;
