//TRIED TO IMPLEMENT EFFECT FOR UNDERSTANDING THIS PART..

import { burn } from '../burn/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const enflamed: StatusEffect = {
    name: 'enflamed',
    type: StatusType.Debuff,
    counterType: StatusCounterType.Intensity,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Effect,
    direction: StatusDirection.Outgoing,
    effects: [burn],
};
