import {
    StatusEvent,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const bolstered: StatusEvent = {
    name: 'bolstered',
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Event,
    event: StatusEventType.OnEndCardPlay,
    type: StatusType.Buff,
};
