import { damageEffect } from "src/game/effects/damage/constants";
import { StatusEffect, StatusType, StatusCounterType, StatusDirection, StatusTrigger } from "../interfaces";

export const grownStatus: StatusEffect = {
    name: 'grown',
    type: StatusType.Buff,
    counterType: StatusCounterType.Intensity,
    direction: StatusDirection.Outgoing,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};