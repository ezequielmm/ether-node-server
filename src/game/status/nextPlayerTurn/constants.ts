import { EVENT_AFTER_PLAYER_TURN_START } from 'src/game/constants';
import {
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const nextPlayerTurnStatus: StatusEvent = {
    name: 'nextPlayerTurn',
    type: StatusType.Buff,
    trigger: StatusTrigger.Event,
    event: EVENT_AFTER_PLAYER_TURN_START,
    startsAt: StatusStartsAt.Instantly,
};
