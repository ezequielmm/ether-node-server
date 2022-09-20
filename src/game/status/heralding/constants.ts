import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusDirection,
    StatusStartsAt,
    StatusType,
    StatusEffect,
    StatusTrigger,
} from '../interfaces';

export const heraldingStatus: StatusEffect = {
    name: 'heralding',
    type: StatusType.Buff,
    direction: StatusDirection.Outgoing,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
