import { EVENT_AFTER_PLAYER_TURN_START } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const spirited: StatusEvent = {
    name: 'spirited',
    type: StatusType.Buff,
    counterType: StatusCounterType.Intensity,
    trigger: StatusTrigger.Event,
    event: EVENT_AFTER_PLAYER_TURN_START,
};
