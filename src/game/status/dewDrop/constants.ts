import { EVENT_BEFORE_CARD_PLAY } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const dewDropStatus: StatusEvent = {
    name: 'dewDrop',
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_CARD_PLAY,
    counterType: StatusCounterType.None,
    type: StatusType.Buff,
};
