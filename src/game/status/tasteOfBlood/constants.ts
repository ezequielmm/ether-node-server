import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const tasteOfBloodBuff: StatusEffect = {
    name: 'tasteOfBlood:buff',
    type: StatusType.Buff,
    counterType: StatusCounterType.Duration,
    direction: StatusDirection.Outgoing,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};

export const tasteOfBloodDebuff: StatusEffect = {
    name: 'tasteOfBlood:debuff',
    type: StatusType.Debuff,
    counterType: StatusCounterType.Duration,
    direction: StatusDirection.Incoming,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
