import { damageEffect } from 'src/game/effects/damage/constants';
import {
    StatusDirection,
    StatusType,
    StatusEffect,
    StatusTrigger,
    StatusCounterType,
} from '../interfaces';

export const heraldingStatus: StatusEffect = {
    name: 'heralding',
    type: StatusType.Buff,
    counterType: StatusCounterType.None,
    direction: StatusDirection.Outgoing,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};
