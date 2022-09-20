import { EVENT_BEFORE_PLAYER_TURN_START } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const sharpenBlade: StatusEvent = {
    name: 'Sharpen Blade',
    type: StatusType.Buff,
    counterType: StatusCounterType.Intensity,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_PLAYER_TURN_START,
    startsAt: StatusStartsAt.Instantly,
};
