import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusTrigger,
    StatusType,
} from '../interfaces';
import { noEffect } from 'src/game/effects/noEffects/constants';

export const revealStatus: StatusEffect = {
    name: 'reveal',
    trigger: StatusTrigger.Effect,
    direction: StatusDirection.Outgoing,
    effects: [noEffect],
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
};
