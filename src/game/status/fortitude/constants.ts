import { defenseEffect } from '../../effects/defense/constants';
import {
    StatusDirection,
    StatusStartsAt,
    StatusType,
    StatusEffect,
    StatusTrigger,
} from '../interfaces';

export const fortitude: StatusEffect = {
    name: 'fortitude',
    type: StatusType.Buff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Effect,
    effects: [defenseEffect],
};
