import { Prop } from '@typegoose/typegoose';
import { GobletTrinket } from './goblet.trinket';

/**
 * Birdcage Upgraded Trinket
 */
export class GobletUpgradedTrinket extends GobletTrinket {
    @Prop({ default: 54 })
    trinketId: number;

    @Prop({ default: 'Goblet+' })
    name: string;

    @Prop({ default: 'On pickup, raise maximum hit points by 15' })
    description: string;

    @Prop({ default: 15 })
    raiseHp: number;
}
