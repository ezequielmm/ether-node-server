import { Prop } from '@typegoose/typegoose';
import { GameContext } from '../../interfaces';
import { PlayerService } from '../../player/player.service';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

/**
 * Goblet Trinket
 */
export class GobletTrinket extends Trinket {
    @Prop({ default: 24 })
    trinketId: number;

    @Prop({ default: 'Goblet' })
    name: string;

    @Prop({ default: 'On pickup, raise maximum hit points by 10' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Uncommon })
    rarity: TrinketRarityEnum;

    @Prop({ default: 10 })
    raiseHp: number;

    async onAttach(ctx: GameContext): Promise<void> {
        const playerService = ctx.moduleRef.get(PlayerService, {
            strict: false,
        });

        playerService.raiseMaxHp(ctx, this.raiseHp);

        this.trigger(ctx);
    }
}
