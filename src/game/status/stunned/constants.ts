import { EVENT_BEFORE_ENEMY_INTENTIONS } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const stunned: StatusEvent = {
    name: 'stunned',
    type: StatusType.Buff,
    counterType: StatusCounterType.None,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_ENEMY_INTENTIONS,
};
