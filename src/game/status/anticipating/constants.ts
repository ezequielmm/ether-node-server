import {
    StatusEvent,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const anticipatingStatus: StatusEvent = {
    name: 'anticipating',
    trigger: StatusTrigger.Event,
    type: StatusType.Buff,
    event: StatusEventType.OnPlayerTurnStart,
    startsAt: StatusStartsAt.Instantly,
};
