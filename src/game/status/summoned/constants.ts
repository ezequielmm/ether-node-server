import { EVENT_ENEMY_DEAD } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const summoned: StatusEvent = {
    name: 'summoned',
    type: StatusType.Debuff,
    counterType: StatusCounterType.None,
    trigger: StatusTrigger.Event,
    event: EVENT_ENEMY_DEAD,
};
