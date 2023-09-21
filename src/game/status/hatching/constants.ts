import { EVENT_BEFORE_ENEMIES_TURN_START } from "src/game/constants";
import { StatusType, StatusCounterType, StatusTrigger, StatusEvent } from "../interfaces";

export const hatchingStatus: StatusEvent = {
    name: 'hatching',
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    trigger: StatusTrigger.Event,
    event: EVENT_BEFORE_ENEMIES_TURN_START,
};
