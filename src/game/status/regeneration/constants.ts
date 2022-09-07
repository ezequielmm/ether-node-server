import {
    StatusEvent,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const regeneration: StatusEvent = {
    name: 'regeneration',
    trigger: StatusTrigger.Event,
    event: StatusEventType.OnBeginCardPlay,
    type: StatusType.Buff,
    startsAt: StatusStartsAt.Instantly,
};
