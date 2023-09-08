import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusTrigger,
    StatusType,
} from '../interfaces';
import { defenseEffect } from 'src/game/effects/defense/constants';

export const hiddenStatus: StatusEffect = {
    name: 'hidden',
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    direction: StatusDirection.Incoming,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect, defenseEffect],
};
