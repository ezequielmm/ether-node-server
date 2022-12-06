import { Prop } from '@typegoose/typegoose';
import { GameContext } from '../../interfaces';
import { Trinket } from '../trinket.schema';

export class PeacockFeatherTrinket extends Trinket {
    @Prop({ default: 'Peacock Feather' })
    name: string;

    onAttach(ctx: GameContext): void {
        ctx.events.addListener('cardPlayed', () => {});
    }

    hola(): void {
        console.log('hola');
    }
}
