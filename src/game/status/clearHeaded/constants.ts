import { EVENT_BEFORE_STATUS_ATTACH } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const clearHeadedStatus: StatusEvent = {
    name: 'Clear Headed',
    type: StatusType.Buff,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_STATUS_ATTACH,
    counterType: StatusCounterType.None,
};
