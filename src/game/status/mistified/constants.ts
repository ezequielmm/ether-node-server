import { EVENT_AFTER_DRAW_CARDS } from 'src/game/constants';
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
    event: EVENT_AFTER_DRAW_CARDS
};
