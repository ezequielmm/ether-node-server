import { Injectable } from '@nestjs/common';
import { HeraldDelayedStatus } from '../heraldDelayed/heraldDelayed.status';
import { StatusDecorator } from '../status.decorator';
import { tasteOfBloodDebuff } from './constants';

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
