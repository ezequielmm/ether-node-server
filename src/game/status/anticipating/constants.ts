import { EVENT_BEFORE_PLAYER_TURN_START } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const anticipatingStatus: StatusEvent = {
    name: 'anticipating',
    trigger: StatusTrigger.Event,
    type: StatusType.Buff,
    counterType: StatusCounterType.None,
    event: EVENT_BEFORE_PLAYER_TURN_START,
};
