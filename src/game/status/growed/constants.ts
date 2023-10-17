import { damageEffect } from "src/game/effects/damage/constants";
import { StatusEffect, StatusType, StatusCounterType, StatusDirection, StatusTrigger } from "../interfaces";

export const growedStatus: StatusEffect = {
    name: 'growed',
    type: StatusType.Buff,
    counterType: StatusCounterType.Intensity,
    direction: StatusDirection.Outgoing,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};