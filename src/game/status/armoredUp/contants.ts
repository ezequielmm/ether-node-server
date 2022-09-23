import { EVENT_AFTER_PLAYER_TURN_START } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const armoredUp: StatusEvent = {
    name: 'armoredUp',
    type: StatusType.Buff,
    counterType: StatusCounterType.None,
    trigger: StatusTrigger.Event,
    event: EVENT_AFTER_PLAYER_TURN_START,
};
