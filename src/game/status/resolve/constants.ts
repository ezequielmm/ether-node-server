import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const resolve: StatusEffect = {
    name: 'resolve',
    type: StatusType.Buff,
    counterType: StatusCounterType.Intensity,
    direction: StatusDirection.Outgoing,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
