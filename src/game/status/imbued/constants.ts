import { EVENT_BEFORE_CARD_PLAY } from 'src/game/constants';
import {
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const imbued: StatusEvent = {
    name: 'imbued',
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_CARD_PLAY,
    type: StatusType.Buff,
    startsAt: StatusStartsAt.Instantly,
};
