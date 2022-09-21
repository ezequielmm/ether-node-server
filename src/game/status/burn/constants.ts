import { EVENT_BEFORE_ENEMIES_TURN_END } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const burn: StatusEvent = {
    name: 'burn',
    type: StatusType.Debuff,
    counterType: StatusCounterType.Intensity,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_ENEMIES_TURN_END,
};
