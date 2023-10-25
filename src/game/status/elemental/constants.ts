import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusType,
    StatusTrigger,
    StatusCounterType,
    StatusEffect,
    StatusDirection,
} from '../interfaces';

export const elementalStatus: StatusEffect = {
    name: 'elemental',
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
    direction: StatusDirection.Incoming,
};
