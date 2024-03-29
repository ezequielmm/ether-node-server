import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const siphoning: StatusEffect = {
    name: 'siphoning',
    type: StatusType.Buff,
    counterType: StatusCounterType.None,
    direction: StatusDirection.Outgoing,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
