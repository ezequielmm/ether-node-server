import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusType,
    StatusTrigger,
    StatusCounterType,
    StatusEffect,
    StatusDirection,
} from '../interfaces';

export const elementalAttackStatus: StatusEffect = {
    name: 'spiritualassault',
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
    direction: StatusDirection.Outgoing,
};
