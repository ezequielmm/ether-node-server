import { energyEffect } from 'src/game/effects/energy/constants';
import {
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const drained: StatusEffect = {
    name: 'drained',
    type: StatusType.Debuff,
    startsAt: StatusStartsAt.NextPlayerTurn,
    trigger: StatusTrigger.Effect,
    direction: StatusDirection.Incoming,
    effects: [energyEffect],
};
