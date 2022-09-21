import { EVENT_BEFORE_PLAYER_TURN_START } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const gifted: StatusEvent = {
    name: 'gifted',
    type: StatusType.Buff,
    counterType: StatusCounterType.Intensity,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_PLAYER_TURN_START,
};
