import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const resolve: StatusEffect = {
    name: 'resolve',
    type: StatusType.Buff,
    direction: StatusDirection.Outgoing,
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
