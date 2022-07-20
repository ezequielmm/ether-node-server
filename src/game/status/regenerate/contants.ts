import {
    StatusEvent,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const regenerate: StatusEvent = {
    name: 'regenerate',
    type: StatusType.Buff,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Event,
    event: StatusEventType.OnTurnEnd,
};
