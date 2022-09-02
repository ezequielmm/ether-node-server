import { EVENT_BEFORE_ENEMY_TURN_END } from 'src/game/constants';
import {
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const burn: StatusEvent = {
    name: 'burn',
    type: StatusType.Debuff,
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_ENEMY_TURN_END,
};
