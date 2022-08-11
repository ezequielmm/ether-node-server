import {
    StatusDirection,
    StatusEffect,
    StatusEvent,
    StatusEventType,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from 'src/game/status/interfaces';
import { damageEffect } from '../../effects/damage/constants';

export const distraught: StatusEffect = {
    name: 'distraught',
    startsAt: StatusStartsAt.Instantly,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
    direction: StatusDirection.Incoming,
    type: StatusType.Debuff,
};

export const distraughtUpdater: StatusEvent = {
    trigger: StatusTrigger.Event,
    event: StatusEventType.OnEnemyTurnStart,
    name: 'distraughtUpdater',
    type: StatusType.Debuff,
    startsAt: StatusStartsAt.Instantly,
};
