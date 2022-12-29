import { Prop } from '@typegoose/typegoose';
import { PanFluteTrinket } from './pan-flute.trinket';

export class GoldPanFluteTrinket extends PanFluteTrinket {
    @Prop({ default: 47 })
    trinketId: number;

    @Prop({ default: 'Gold Pan Flute' })
    name: string;

    @Prop({ default: 'At the start of combat, gain 3 Resolve' })
    description: string;

    @Prop({ default: 3 })
    resolveToGain: number;
}
