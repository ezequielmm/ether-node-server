import { Prop } from '@typegoose/typegoose';
import { PanFluteTrinket } from './pan-flute.trinket';

export class SilverPanFluteTrinket extends PanFluteTrinket {
    @Prop({ default: 46 })
    trinketId: number;

    @Prop({ default: 'Silver Pan Flute' })
    name: string;

    @Prop({ default: 'At the start of combat, gain 2 Resolve' })
    description: string;

    @Prop({ default: 2 })
    resolveToGain: number;
}
