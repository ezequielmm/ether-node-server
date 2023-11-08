import { EVENT_AFTER_ENEMIES_TURN_END, EVENT_AFTER_PLAYER_TURN_START } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const mistifiedStatus: StatusEvent = {
    name: 'mistified',
    type: StatusType.Debuff,
    counterType: StatusCounterType.Counter,
    trigger: StatusTrigger.Event,
    event: EVENT_AFTER_PLAYER_TURN_START
};
