import { EVENT_BEFORE_PLAYER_TURN_START } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const drained: StatusEvent = {
    name: 'drained',
    type: StatusType.Debuff,
    counterType: StatusCounterType.Intensity,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_PLAYER_TURN_START,
};
