import { Prop } from '@typegoose/typegoose';
import { EVENT_AFTER_INIT_COMBAT } from 'src/game/constants';
import { EffectService } from 'src/game/effects/effects.service';
import { healEffect } from 'src/game/effects/heal/constants';
import { CombatQueueService } from '../../combatQueue/combatQueue.service';
import { GameContext } from '../../interfaces';
import { PlayerService } from '../../player/player.service';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

/**
 * Phoenix Egg Trinket
 */
export class PhoenixEggTrinket extends Trinket {
    @Prop({ default: 29 })
    trinketId: number;

    @Prop({ default: 'Phoenix Egg' })
    name: string;

    @Prop({ default: 'At the start of combat, heal 1 hit point' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Rare })
    rarity: TrinketRarityEnum;

    @Prop({ default: 1 })
    hitPointsToAdd: number;

    async onAttach(ctx: GameContext): Promise<void> {
        ctx.events.addListener(EVENT_AFTER_INIT_COMBAT, async () => {
            const opts = {
                strict: false,
            };
            const playerService = ctx.moduleRef.get(PlayerService, opts);
            const effectService = ctx.moduleRef.get(EffectService, opts);
            const combatQueueService = ctx.moduleRef.get(
                CombatQueueService,
                opts,
            );

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

            await combatQueueService.end(ctx);
        });
    }
}
