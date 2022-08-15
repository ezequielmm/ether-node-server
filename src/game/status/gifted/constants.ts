import { defenseEffect } from 'src/game/effects/defense/constants';
import {
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const gifted: StatusEffect = {
    name: 'gifted',
    type: StatusType.Buff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Effect,
    effects: [defenseEffect],
};
