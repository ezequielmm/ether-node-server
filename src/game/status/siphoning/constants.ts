import { EVENT_AFTER_DAMAGE_EFFECT } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const siphoning: StatusEvent = {
    name: 'siphoning',
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    trigger: StatusTrigger.Event,
    event: EVENT_AFTER_DAMAGE_EFFECT,
};
