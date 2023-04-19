import { Prop } from '@typegoose/typegoose';
import { EVENT_AFTER_END_COMBAT } from 'src/game/constants';
import { EffectService } from 'src/game/effects/effects.service';
import { healEffect } from 'src/game/effects/heal/constants';
import { GameContext } from '../../interfaces';
import { PlayerService } from '../../player/player.service';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

/**
 * Gold needle Trinket
 */
export class GoldNeedleTrinket extends Trinket {
    @Prop({ default: 19 })
    trinketId: number;

    @Prop({ default: 'Gold Needle' })
    name: string;

    @Prop({ default: 'Heal 3 hit points at the end of each combat' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Common })
    rarity: TrinketRarityEnum;

    @Prop({ default: 3 })
    hitPointsToAdd: number;

    async onAttach(ctx: GameContext): Promise<void> {
        ctx.events.addListener(EVENT_AFTER_END_COMBAT, async () => {
            const playerService = ctx.moduleRef.get(PlayerService, {
                strict: false,
            });
            const effectService = ctx.moduleRef.get(EffectService, {
                strict: false,
            });

            const player = playerService.get(ctx);

            this.trigger(ctx);

            await effectService.apply({
                ctx,
                source: player,
                target: player,
                effect: {
                    effect: healEffect.name,
                    args: {
                        value: this.hitPointsToAdd,
                    },
                },
            });
        });
    }
}
