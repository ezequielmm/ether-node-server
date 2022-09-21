import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from 'src/game/status/interfaces';
import { damageEffect } from '../../effects/damage/constants';

export const distraught: StatusEffect = {
    name: 'distraught',
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
    direction: StatusDirection.Incoming,
    type: StatusType.Debuff,
    counterType: StatusCounterType.Duration,
};
