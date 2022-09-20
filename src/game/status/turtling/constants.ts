import { EVENT_BEFORE_PLAYER_TURN_END } from 'src/game/constants';
import {
    StatusStartsAt,
    StatusType,
    StatusTrigger,
    StatusEvent,
    StatusCounterType,
} from '../interfaces';

export const turtling: StatusEvent = {
    name: 'turtling',
    type: StatusType.Buff,
    counterType: StatusCounterType.Duration,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_PLAYER_TURN_END,
};
