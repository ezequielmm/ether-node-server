import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GameContext } from '../../interfaces';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

@Schema()
export class PeacockFeatherTrinket extends Trinket {
    @Prop({ default: 'Peacock Feather' })
    name: string;

    constructor() {
        super();
        this.name = 'Peacock Feather';
        this.description = 'Every 20th card played costs 0 Energy';
        this.rarity = TrinketRarityEnum.Common;
    }

    onAttach(ctx: GameContext): void {
        ctx.events.addListener('cardPlayed', () => {});
    }
}

export const PeacockFeatherTrinketSchema = SchemaFactory.createForClass(
    PeacockFeatherTrinket,
).loadClass(PeacockFeatherTrinket);
