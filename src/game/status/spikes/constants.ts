import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const spikesStatus: StatusEffect = {
    name: 'spikes',
    trigger: StatusTrigger.Effect,
    direction: StatusDirection.Incoming,
    effects: [damageEffect],
    type: StatusType.Buff,
    counterType: StatusCounterType.Intensity,
};
