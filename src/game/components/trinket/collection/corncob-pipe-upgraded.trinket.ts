import { Prop } from '@typegoose/typegoose';
import { CorncobPipeTrinket } from './corncob-pipe.trinket';

export class CorncobPipeUpgradedTrinket extends CorncobPipeTrinket {
    @Prop({ default: 50 })
    trinketId: number;

    @Prop({ default: 'Corncob Pipe+' })
    name: string;

    @Prop({ default: 'All Burn effects apply +2 Burn' })
    description: string;

    @Prop({ default: 2 })
    burnIncrement: number;
}
