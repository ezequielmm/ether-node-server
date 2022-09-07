import {
    StatusEvent,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const initialCard: StatusEvent = {
    name: 'initialCard',
    type: StatusType.Debuff,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Event,
    event: StatusEventType.OnPlayerTurnStart,
};
