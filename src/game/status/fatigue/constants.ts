import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const fatigue: StatusEffect = {
    name: 'fatigue',
    effects: [damageEffect],
    type: StatusType.Debuff,
    counterType: StatusCounterType.Duration,
    direction: StatusDirection.Outgoing,
    trigger: StatusTrigger.Effect,
};
