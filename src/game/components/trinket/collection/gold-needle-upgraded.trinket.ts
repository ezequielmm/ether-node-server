import { Prop } from '@typegoose/typegoose';
import { GoldNeedleTrinket } from './gold-needle.trinket';

/**
 * Gold needle Trinket
 */
export class GoldNeedleUpgradedTrinket extends GoldNeedleTrinket {
    @Prop({ default: 'Gold Needle+' })
    name: string;

    @Prop({ default: 'Heal 6 hit points at the end of each combat' })
    description: string;

    @Prop({ default: 6 })
    hitPointsToAdd: number;
}
