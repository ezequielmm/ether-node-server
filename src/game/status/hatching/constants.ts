import { StatusEffect, StatusType, StatusCounterType, StatusDirection, StatusTrigger } from "../interfaces";

export const hatchingStatus: StatusEffect = {
    name: 'hatching',
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    direction: StatusDirection.Outgoing,
    trigger: StatusTrigger.Effect,
    effects: [],
};
