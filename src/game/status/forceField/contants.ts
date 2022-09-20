import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const forceField: StatusEffect = {
    name: 'forceField',
    type: StatusType.Buff,
    counterType: StatusCounterType.None,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
