import { Prop } from '@typegoose/typegoose';
import { RunicTomeTrinket } from './runic-tome.trinket';

/**
 * Runict Tome Trinket
 */
export class RunicTomeUpgradedTrinket extends RunicTomeTrinket {
    @Prop({ default: 53 })
    trinketId: number;

    @Prop({ default: 'Runic Tome+' })
    name: string;

    @Prop({
        default: 'On pickup, choose up to 3 of 5 cards to add to your deck',
    })
    description: string;

    @Prop({ default: 3 })
    cardsToTake: number;
}
