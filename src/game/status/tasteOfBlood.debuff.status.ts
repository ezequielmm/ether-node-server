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

export const tasteOfBloodDebuff: StatusEffect = {
    name: 'tasteOfBlood:debuff',
    type: StatusType.Debuff,
    direction: StatusDirection.Incoming,
    startsAt: StatusStartsAt.NextTurn,
    trigger: StatusTrigger.Effect,
    effects: [damageEffect],
};

/**
 * Taste of Blood buff.
 *
 * @description
 * This status is a debuff that increases the damage received of the next
 * damage effect handled by the enemy.
 * Note that it extends from HeraldDelayedStatus, it has the same behavior.
 */
@StatusDecorator({
    status: tasteOfBloodDebuff,
})
@Injectable()
export class TasteOfBloodDebuffStatus extends HeraldDelayedStatus {}
