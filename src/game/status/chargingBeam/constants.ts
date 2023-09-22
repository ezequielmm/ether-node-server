import {
    StatusCounterType,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';
import { EVENT_BEFORE_ENEMIES_TURN_START } from 'src/game/constants';

export const chargingBeam: StatusEvent = {
    name: 'chargingBeam',
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_ENEMIES_TURN_START,
};