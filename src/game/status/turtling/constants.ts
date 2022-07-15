import { defenseEffect } from '../../effects/constants';
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
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Effect,
    effects: [defenseEffect],
};
