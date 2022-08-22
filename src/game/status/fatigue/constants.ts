import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const fatigue: StatusEffect = {
    name: 'fatigue',
    effects: [damageEffect],
    startsAt: StatusStartsAt.Instantly,
    type: StatusType.Debuff,
    direction: StatusDirection.Outgoing,
    trigger: StatusTrigger.Effect,
};
