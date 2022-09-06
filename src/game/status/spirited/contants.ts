import { EVENT_BEFORE_PLAYER_TURN_START } from 'src/game/constants';
import {
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const spirited: StatusEvent = {
    name: 'spirited',
    type: StatusType.Buff,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_PLAYER_TURN_START,
};
