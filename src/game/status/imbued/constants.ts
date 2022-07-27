import {
    StatusEvent,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const imbued: StatusEvent = {
    trigger: StatusTrigger.Event,
    event: StatusEventType.OnEndCardPlay,
    name: 'imbued',
    type: StatusType.Buff,
    startsAt: StatusStartsAt.Instantly,
};
