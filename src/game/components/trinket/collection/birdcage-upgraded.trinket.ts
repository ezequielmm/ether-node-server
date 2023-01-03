import { Prop } from '@typegoose/typegoose';
import { BirdcageTrinket } from './birdcage.trinket';

/**
 * Birdcage Upgraded Trinket
 */
export class BirdcageUpgradedTrinket extends BirdcageTrinket {
    @Prop({ default: 'Birdcage+' })
    name: string;

    @Prop({ default: 'Every 4th attack deals 4 more damage' })
    description: string;

    @Prop({ default: 4 })
    damage: number;
}
