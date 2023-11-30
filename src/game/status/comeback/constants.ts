import { EVENT_AFTER_ENEMIES_TURN_END } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const comebackStatus: StatusEvent = {
    name: 'comeback',
    type: StatusType.Debuff,
    counterType: StatusCounterType.Counter,
    trigger: StatusTrigger.Event,
    event: EVENT_AFTER_ENEMIES_TURN_END,
};