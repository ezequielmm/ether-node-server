import {
    EVENT_BEFORE_ENEMIES_TURN_START,
    EVENT_BEFORE_PLAYER_TURN_START,
} from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const regeneration: StatusEvent = {
    name: 'regeneration',
    type: StatusType.Buff,
    counterType: StatusCounterType.Intensity,
    trigger: StatusTrigger.Event,
    event: [EVENT_BEFORE_PLAYER_TURN_START, EVENT_BEFORE_ENEMIES_TURN_START],
};
