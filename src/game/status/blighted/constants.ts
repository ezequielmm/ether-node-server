import { EVENT_BEFORE_CARD_PLAY } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const blightedStatus: StatusEvent = {
    name: 'blighted',
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_CARD_PLAY,
    counterType: StatusCounterType.Counter,
    type: StatusType.Debuff,
};
