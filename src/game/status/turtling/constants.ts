import { EVENT_BEFORE_PLAYER_TURN_END } from 'src/game/constants';
import {
    StatusStartsAt,
    StatusType,
    StatusTrigger,
    StatusEvent,
} from '../interfaces';

export const turtling: StatusEvent = {
    name: 'turtling',
    type: StatusType.Buff,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_PLAYER_TURN_END,
};
