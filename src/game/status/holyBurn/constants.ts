import { holyExplosion } from 'src/game/effects/holyExplosion/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusTrigger,
    StatusType,
} from '../interfaces';

export const holyBurn: StatusEffect = {
    name: 'holyBurn',
    type: StatusType.Debuff,
    counterType: StatusCounterType.Intensity,
    direction: StatusDirection.Outgoing,
    trigger: StatusTrigger.Effect,
    effects: [holyExplosion],
};

export const holyBurnPlus: StatusEffect = {
    name: 'holyBurn-plus',
    type: StatusType.Debuff,
    counterType: StatusCounterType.Intensity,
    direction: StatusDirection.Outgoing,
    trigger: StatusTrigger.Effect,
    effects: [holyExplosion],
};
