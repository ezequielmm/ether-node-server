import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';
import { EVENT_BEFORE_ENEMIES_TURN_START } from 'src/game/constants';

export const revealStatus: StatusEvent = {
    name: 'reveal',
    trigger: StatusTrigger.Event,
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    event: EVENT_BEFORE_ENEMIES_TURN_START,
};

