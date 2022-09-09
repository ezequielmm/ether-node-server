import { defenseEffect } from '../../effects/defense/constants';
import {
    StatusDirection,
    StatusStartsAt,
    StatusType,
    StatusEffect,
    StatusTrigger,
} from '../interfaces';

export const turtling: StatusEffect = {
    name: 'turtling',
    type: StatusType.Buff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.NextPlayerTurn,
    trigger: StatusTrigger.Effect,
    effects: [defenseEffect],
};
