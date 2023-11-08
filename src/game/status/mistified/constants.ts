import { EVENT_BEFORE_ENEMIES_TURN_END, EVENT_BEFORE_PLAYER_TURN_END } from 'src/game/constants';
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
    event: EVENT_BEFORE_ENEMIES_TURN_END
};
