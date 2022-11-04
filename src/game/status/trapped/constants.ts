import { EVENT_BEFORE_STATUS_ATTACH } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const trapped: StatusEvent = {
    name: 'trapped',
    type: StatusType.Buff,
    counterType: StatusCounterType.None,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_STATUS_ATTACH,
};
