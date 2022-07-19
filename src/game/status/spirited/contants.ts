import {
    StatusEvent,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const spirited: StatusEvent = {
    name: 'spirited',
    type: StatusType.Buff,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Event,
    event: StatusEventType.OnPlayerTurnStart,
};
