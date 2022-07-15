import { damageEffect } from '../../effects/constants';
import {
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const tasteOfBloodBuff: StatusEffect = {
    name: 'tasteOfBlood:buff',
    type: StatusType.Buff,
    direction: StatusDirection.Outgoing,
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};

export const tasteOfBloodDebuff: StatusEffect = {
    name: 'tasteOfBlood:debuff',
    type: StatusType.Debuff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
