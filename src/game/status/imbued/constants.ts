import {
    StatusEvent,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const imbued: StatusEvent = {
    name: 'imbued',
    trigger: StatusTrigger.Event,
    event: StatusEventType.OnEndCardPlay,
    type: StatusType.Buff,
    startsAt: StatusStartsAt.Instantly,
};
