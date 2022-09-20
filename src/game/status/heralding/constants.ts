import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusDirection,
    StatusStartsAt,
    StatusType,
    StatusEffect,
    StatusTrigger,
    StatusCounterType,
} from '../interfaces';

export const heraldingStatus: StatusEffect = {
    name: 'heralding',
    type: StatusType.Buff,
    counterType: StatusCounterType.None,
    direction: StatusDirection.Outgoing,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
