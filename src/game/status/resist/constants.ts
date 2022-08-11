import {
    StatusEvent,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const resist: StatusEvent = {
    name: 'resist',
    type: StatusType.Buff,
    trigger: StatusTrigger.Event,
    event: StatusEventType.OnAttachStatus,
    startsAt: StatusStartsAt.Instantly,
};
