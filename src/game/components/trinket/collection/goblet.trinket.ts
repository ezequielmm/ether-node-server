import { Prop } from '@typegoose/typegoose';
import { GameContext } from '../../interfaces';
import { PlayerService } from '../../player/player.service';
import { TrinketRarityEnum } from '../trinket.enum';
import { OneUseTrinket } from './one-use.trinket';

/**
 * Goblet Trinket
 */
export class GobletTrinket extends OneUseTrinket {
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
        // If the trinket has already been used, we don't need to do anything
        if (this.isUsed()) return;

        const playerService = ctx.moduleRef.get(PlayerService, {
            strict: false,
        });

        await playerService.setMaxHPDelta(ctx, this.raiseHp, true);
        await this.markAsUsed(ctx);

        this.trigger(ctx);
    }
}
