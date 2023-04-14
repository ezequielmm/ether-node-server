import { Prop } from '@typegoose/typegoose';
import { WhistleTrinket } from './whistle.trinket';

/**
 * Whistle Upgraded Trinket
 */
export class WhistleUpgradedTrinket extends WhistleTrinket {
    @Prop({ default: 26 })
    trinketId: number;

    @Prop({ default: 'Whistle+' })
    name: string;

    @Prop({
        default:
            'At the start of the 3rd combat turn, gain 2 Resolve and 2 Fortitude',
    })
    description: string;

    @Prop({ default: 2 })
    resolveToAdd: number;

    @Prop({ default: 2 })
    fortitudeToAdd: number;
}
