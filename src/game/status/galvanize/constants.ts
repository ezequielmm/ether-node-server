import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusTrigger,
    StatusType,
} from '../interfaces';
import { damageEffect } from 'src/game/effects/damage/constants';

export const galvanize: StatusEffect = {
    name: 'galvanize',
    type: StatusType.Buff,
    counterType: StatusCounterType.None,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
    direction: StatusDirection.Incoming,
};
