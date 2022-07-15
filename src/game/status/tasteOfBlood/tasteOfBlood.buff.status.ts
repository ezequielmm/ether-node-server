import { Injectable } from '@nestjs/common';
import { HeraldDelayedStatus } from '../heraldDelayed/heraldDelayed.status';
import { StatusDecorator } from '../status.decorator';
import { tasteOfBloodBuff } from './constants';

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
