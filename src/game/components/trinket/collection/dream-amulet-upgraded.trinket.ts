import { Prop } from '@typegoose/typegoose';
import { DreamAmuletTrinket } from './dream-amulet.trinket';

export class DreamAmuletUpgradedTrinket extends DreamAmuletTrinket {
    @Prop({ default: 'Corncob Pipe+' })
    name: string;

    @Prop({ default: 'Draw 2 extra cards each turn.' })
    description: string;

    @Prop({ default: 2 })
    cardsToDraw: number;
}
