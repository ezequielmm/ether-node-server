import { Prop } from '@typegoose/typegoose';
import { EVENT_AFTER_INIT_COMBAT } from 'src/game/constants';
import { defenseEffect } from 'src/game/effects/defense/constants';
import { EffectService } from 'src/game/effects/effects.service';
import { GameContext } from '../../interfaces';
import { PlayerService } from '../../player/player.service';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

/**
 * Broken stalactite Trinket
 */
export class BrokenStalactiteTrinket extends Trinket {
    @Prop({ default: 16 })
    trinketId: number;

    @Prop({ default: 'Broken Stalactite' })
    name: string;

    @Prop({ default: 'At start of combat, gain 5 Defense' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Common })
    rarity: TrinketRarityEnum;

    async onAttach(ctx: GameContext): Promise<void> {
        ctx.events.addListener(EVENT_AFTER_INIT_COMBAT, async () => {
            const effectService = ctx.moduleRef.get(EffectService, {
                strict: false,
            });
            const playerService = ctx.moduleRef.get(PlayerService, {
                strict: false,
            });

            const player = playerService.get(ctx);

            await effectService.apply({
                ctx,
                source: player,
                target: player,
                effect: {
                    effect: defenseEffect.name,
                    args: {
                        value: 5,
                    },
                },
            });

            this.trigger(ctx);
        });
    }
}
