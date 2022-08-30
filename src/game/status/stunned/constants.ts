import { EVENT_BEFORE_ENEMIES_TURN_START } from 'src/game/constants';
import {
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const stunned: StatusEvent = {
    name: 'stunned',
    startsAt: StatusStartsAt.Instantly,
    type: StatusType.Buff,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_ENEMIES_TURN_START,
};
