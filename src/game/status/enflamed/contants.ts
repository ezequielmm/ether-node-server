//TRIED TO IMPLEMENT EFFECT FOR UNDERSTANDING THIS PART..

import {
    StatusEvent,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const enflamed: StatusEvent = {
    name: 'enflamed',
    type: StatusType.Buff,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Event,
    event: StatusEventType.OnAttachStatus,
};
