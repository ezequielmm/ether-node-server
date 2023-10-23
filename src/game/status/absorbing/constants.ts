import { damageEffect } from "src/game/effects/damage/constants";
import { StatusEffect, StatusTrigger, StatusDirection, StatusType, StatusCounterType } from "../interfaces";

export const absorbingStatus: StatusEffect = {
    name: 'absorbing',
    trigger: StatusTrigger.Effect,
    direction: StatusDirection.Incoming,
    effects: [damageEffect],
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    ghost: true
};