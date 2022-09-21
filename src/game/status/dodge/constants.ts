import { damageEffect } from 'src/game/effects/damage/constants';
import {
    Status,
    StatusCounterType,
    StatusDirection,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const dodge: Status = {
    name: 'dodge',
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
