import { EVENT_BEFORE_PLAYER_TURN_START } from 'src/game/constants';
import {
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const anticipatingStatus: StatusEvent = {
    name: 'anticipating',
    trigger: StatusTrigger.Event,
    type: StatusType.Buff,
    event: EVENT_BEFORE_PLAYER_TURN_START,
    startsAt: StatusStartsAt.Instantly,
};
