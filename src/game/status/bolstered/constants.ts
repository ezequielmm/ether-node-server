import { EVENT_AFTER_CARD_PLAY } from 'src/game/constants';
import {
    StatusEvent,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const bolstered: StatusEvent = {
    name: 'bolstered',
    startsAt: StatusStartsAt.NextPlayerTurn,
    trigger: StatusTrigger.Event,
    event: EVENT_AFTER_CARD_PLAY,
    type: StatusType.Buff,
};
