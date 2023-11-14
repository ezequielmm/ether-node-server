import { damageEffect } from "src/game/effects/damage/constants";
import { StatusEffect, StatusType, StatusCounterType, StatusDirection, StatusTrigger } from "../interfaces";

export const onFireStatus: StatusEffect = {
    name: 'onFire',
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    direction: StatusDirection.Incoming,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};