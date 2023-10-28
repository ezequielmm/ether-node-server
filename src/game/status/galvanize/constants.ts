import { EVENT_AFTER_CARD_PLAY } from 'src/game/constants';
import {
    StatusCounterType,
    StatusDirection,
    StatusEffect,
    StatusEvent,
    StatusTrigger,
    StatusType,
} from '../interfaces';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { damageEffect } from 'src/game/effects/damage/constants';

export const galvanize: StatusEvent = {
    name: 'galvanize',
    type: StatusType.Buff,
    counterType: StatusCounterType.Counter,
    trigger: StatusTrigger.Event,
    event: EVENT_AFTER_CARD_PLAY,
};
