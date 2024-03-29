import { EVENT_AFTER_CARD_PLAY, EVENT_AFTER_DAMAGE_EFFECT } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const galvanize: StatusEvent = {
    name: 'galvanized',
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    trigger: StatusTrigger.Event,
    event: EVENT_AFTER_DAMAGE_EFFECT,
};
