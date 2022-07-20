import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const spikesStatus: StatusEffect = {
    name: 'spikes',
    trigger: StatusTrigger.Effect,
    direction: StatusDirection.Incoming,
    effects: [damageEffect],
    type: StatusType.Buff,
    startsAt: StatusStartsAt.Instantly,
};
