import { EVENT_BEFORE_ENEMIES_TURN_START } from 'src/game/constants';
import {
    StatusDirection,
    StatusEffect,
    StatusEvent,
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
    event: EVENT_BEFORE_ENEMIES_TURN_START,
    name: 'distraughtUpdater',
    type: StatusType.Debuff,
    startsAt: StatusStartsAt.Instantly,
};
