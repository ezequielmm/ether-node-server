import { EVENT_BEFORE_PLAYER_TURN_START } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const prayingStatus: StatusEvent = {
    name: 'Praying',
    trigger: StatusTrigger.Event,
    type: StatusType.Buff,
    counterType: StatusCounterType.Duration,
    event: EVENT_BEFORE_PLAYER_TURN_START,
    startsAt: StatusStartsAt.Instantly,
};
