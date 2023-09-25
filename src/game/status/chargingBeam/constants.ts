import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const chargingBeam: StatusEffect = {
    name: 'chargingBeam',
    type: StatusType.Buff,
    direction: StatusDirection.Incoming,
    counterType: StatusCounterType.Counter,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
