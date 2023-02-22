import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const intercept: StatusEffect = {
    name: 'intercept',
    type: StatusType.Buff,
    counterType: StatusCounterType.Duration,
    direction: StatusDirection.Incoming,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
