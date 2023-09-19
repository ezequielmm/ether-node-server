import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusTrigger,
    StatusType,
} from '../interfaces';
import { transformEffect } from 'src/game/effects/transform/constants';

export const revealStatus: StatusEffect = {
    name: 'reveal',
    trigger: StatusTrigger.Effect,
    direction: StatusDirection.Incoming,
    effects: [damageEffect],
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
};
