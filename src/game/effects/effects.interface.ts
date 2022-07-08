import { Socket } from 'socket.io';
import { CardTargetedEnum } from '../components/card/card.enum';
import { EffectName } from './effects.enum';
import { TargetId } from './effects.types';

export interface BaseEffectDTO {
    client: Socket;
    targetId?: TargetId;
    calculatedValue: number;
    times: number;
    targeted: CardTargetedEnum;
    useDefense?: boolean;
    useEnemies?: boolean;
    multiplier?: number;
}

export interface IBaseEffect {
    handle: (...args: BaseEffectDTO[]) => Promise<void>;
}

export interface JsonEffect {
    name: EffectName;
    args: {
        baseValue: number;
        calculatedValue: number;
        targeted: CardTargetedEnum;
        times: number;
        useDefense?: boolean;
        useEnemies?: boolean;
        multiplier?: number;
    };
}

export type DamageDTO = BaseEffectDTO;
export type DefenseDTO = BaseEffectDTO;
export type DrawCardDTO = BaseEffectDTO;
export type HealCardDTO = BaseEffectDTO;
export type EnergyDTO = BaseEffectDTO;
export type RemoveDefenseDTO = BaseEffectDTO;
