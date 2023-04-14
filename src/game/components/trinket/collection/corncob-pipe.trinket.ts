import { Prop } from '@typegoose/typegoose';
import { EVENT_BEFORE_STATUS_ATTACH } from 'src/game/constants';
import { burn } from 'src/game/status/burn/constants';
import { BeforeStatusAttachEvent } from 'src/game/status/interfaces';
import { GameContext } from '../../interfaces';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

/**
 * Corncob pipe Trinket
 */
export class CorncobPipeTrinket extends Trinket {
    @Prop({ default: 9 })
    trinketId: number;

    @Prop({ default: 'Corncob Pipe' })
    name: string;

    @Prop({ default: 'All Burn effects apply +1 Burn' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Common })
    rarity: TrinketRarityEnum;

    @Prop({ default: 1 })
    burnIncrement: number;

    async onAttach(ctx: GameContext): Promise<void> {
        ctx.events.addListener(
            EVENT_BEFORE_STATUS_ATTACH,
            (args: BeforeStatusAttachEvent) => {
                if (
                    args.status.name === burn.name &&
                    args.target.type === 'enemy'
                ) {
                    args.status.args.counter += this.burnIncrement;
                    this.trigger(ctx);
                }
            },
        );
    }
}
