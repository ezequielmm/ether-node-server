import { EVENT_BEFORE_CARD_PLAY } from 'src/game/constants';
import {
    StatusCounterType,
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const bolstered: StatusEvent = {
    name: 'bolstered',
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_CARD_PLAY,
    type: StatusType.Buff,
    counterType: StatusCounterType.Intensity,
};
