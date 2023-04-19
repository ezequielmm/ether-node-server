import { Prop } from '@typegoose/typegoose';
import { PeacockFeatherTrinket } from './peacock-feather.trinket';

/**
 * Peacock Feather Upgraded Trinket
 */
export class PeacockFeatherUpgradedTrinket extends PeacockFeatherTrinket {
    @Prop({ default: 58 })
    trinketId: number;

    @Prop({ default: 'Peacock Feather+' })
    name: string;

    @Prop({ default: 'Every 15th card played costs 0 Energy' })
    description: string;

    @Prop({ default: 15 })
    counterCardPlayed: number;
}
