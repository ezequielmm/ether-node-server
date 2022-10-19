import { defenseEffect } from 'src/game/effects/defense/constants';
import {
    StatusType,
    StatusTrigger,
    StatusCounterType,
    StatusEffect,
    StatusDirection,
} from '../interfaces';

export const feebleStatus: StatusEffect = {
    name: 'Feeble',
    type: StatusType.Debuff,
    counterType: StatusCounterType.Duration,
    trigger: StatusTrigger.Effect,
    effects: [defenseEffect],
    direction: StatusDirection.Incoming,
};
