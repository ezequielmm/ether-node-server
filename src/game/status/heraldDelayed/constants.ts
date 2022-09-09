import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusDirection,
    StatusStartsAt,
    StatusType,
    StatusEffect,
    StatusTrigger,
} from '../interfaces';

export const heraldDelayed: StatusEffect = {
    name: 'heraldDelayed',
    type: StatusType.Buff,
    direction: StatusDirection.Outgoing,
    startsAt: StatusStartsAt.NextPlayerTurn,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
