import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const doubleDown: StatusEffect = {
    name: 'doubleDown',
    type: StatusType.Buff,
    counterType: StatusCounterType.Intensity,
    trigger: StatusTrigger.Effect,
    direction: StatusDirection.Outgoing,
    effects: [damageEffect],
};
