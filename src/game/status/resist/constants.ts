import { EVENT_BEFORE_STATUS_ATTACH } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const resist: StatusEvent = {
    name: 'resist',
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_STATUS_ATTACH,
};
