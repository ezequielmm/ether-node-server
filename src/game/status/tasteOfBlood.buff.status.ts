import { Injectable } from '@nestjs/common';
import { damageEffect } from '../effects/constants';
import { HeraldDelayedStatus } from './heraldDelayed.status';
import {
    StatusDirection,
    StatusEffect,
    StatusStartsAt,
    StatusTrigger,
    StatusType,
} from './interfaces';
import { StatusDecorator } from './status.decorator';

export const tasteOfBloodBuff: StatusEffect = {
    name: 'tasteOfBlood:buff',
    type: StatusType.Buff,
    direction: StatusDirection.Outgoing,
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};

/**
 * Taste of Blood buff.
 *
 * @description
 * This status is a buff that increases the damage of the next damage effect.
 * Note that it extends from HeraldDelayedStatus, it has the same behavior.
 */
@StatusDecorator({
    status: tasteOfBloodBuff,
})
@Injectable()
export class TasteOfBloodBuffStatus extends HeraldDelayedStatus {}
