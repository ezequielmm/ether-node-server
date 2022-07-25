import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const doubleDown: StatusEffect = {
    name: 'doubleDown',
    type: StatusType.Buff,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Effect,
    direction: StatusDirection.Outgoing,
    effects: [damageEffect],
};
