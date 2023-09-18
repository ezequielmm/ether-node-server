import { damageEffect } from 'src/game/effects/damage/constants';
import {
    Status,
    StatusCounterType,
    StatusDirection,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const chargingBeam: Status = {
    name: 'chargingBeam',
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    direction: StatusDirection.Outgoing,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
