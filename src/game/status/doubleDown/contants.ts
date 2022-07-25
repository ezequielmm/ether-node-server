import {
    Status,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const doubleDown: Status = {
    name: 'doubleDown',
    type: StatusType.Buff,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Event,
    event: StatusEventType.OnTurnEnd,
};
