import { damageEffect } from 'src/game/effects/damage/constants';
import {
    Status,
    StatusDirection,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const dodge: Status = {
    name: 'dodge',
    type: StatusType.Buff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
