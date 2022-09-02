import { EVENT_BEFORE_STATUS_ATTACH } from 'src/game/constants';
import {
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const resist: StatusEvent = {
    name: 'resist',
    type: StatusType.Buff,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_STATUS_ATTACH,
    startsAt: StatusStartsAt.Instantly,
};
