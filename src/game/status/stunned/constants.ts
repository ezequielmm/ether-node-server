import { EVENT_BEFORE_ENEMY_INTENTIONS } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const stunned: StatusEvent = {
    name: 'stunned',
    startsAt: StatusStartsAt.Instantly,
    type: StatusType.Buff,
    counterType: StatusCounterType.None,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_ENEMY_INTENTIONS,
};
