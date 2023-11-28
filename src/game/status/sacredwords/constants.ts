import { EVENT_BEFORE_ENEMIES_TURN_END } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const sacretwords: StatusEvent = {
    name: 'sacred words',
    type: StatusType.Debuff,
    counterType: StatusCounterType.Intensity,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_ENEMIES_TURN_END,
};
