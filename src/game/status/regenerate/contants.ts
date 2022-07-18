import { healEffect } from 'src/game/effects/constants';
import {
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const regenerate: StatusEffect = {
    name: 'regenerate',
    type: StatusType.Buff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Effect,
    effects: [healEffect],
};
