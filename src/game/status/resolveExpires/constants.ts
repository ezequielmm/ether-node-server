import { EVENT_BEFORE_PLAYER_TURN_END } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const resolveExpiresStatus: StatusEvent = {
    name: 'Resolve Expires',
    counterType: StatusCounterType.Intensity,
    type: StatusType.Debuff,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_PLAYER_TURN_END,
};
