import {
    StatusEvent,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const sharpenBlade: StatusEvent = {
    name: 'Sharpen Blade',
    type: StatusType.Buff,
    trigger: StatusTrigger.Event,
    event: StatusEventType.OnPlayerTurnStart,
    startsAt: StatusStartsAt.Instantly,
};
