import {
    EVENT_BEFORE_ENEMIES_TURN_START,
    EVENT_BEFORE_PLAYER_TURN_START,
} from 'src/game/constants';
import {
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const regenerate: StatusEvent = {
    name: 'regenerate',
    type: StatusType.Buff,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Event,
    event: [EVENT_BEFORE_PLAYER_TURN_START, EVENT_BEFORE_ENEMIES_TURN_START],
};
