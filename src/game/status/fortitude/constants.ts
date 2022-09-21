import { defenseEffect } from '../../effects/defense/constants';
import {
    StatusDirection,
    StatusType,
    StatusEffect,
    StatusTrigger,
    StatusCounterType,
} from '../interfaces';

export const fortitude: StatusEffect = {
    name: 'fortitude',
    type: StatusType.Buff,
    counterType: StatusCounterType.Intensity,
    direction: StatusDirection.Incoming,
    trigger: StatusTrigger.Effect,
    effects: [defenseEffect],
};
