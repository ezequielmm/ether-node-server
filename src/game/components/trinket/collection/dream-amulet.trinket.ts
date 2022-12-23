import { Prop } from '@typegoose/typegoose';
import { EVENT_AFTER_INIT_COMBAT } from 'src/game/constants';
import { drawCardEffect } from 'src/game/effects/drawCard/constants';
import { EffectService } from 'src/game/effects/effects.service';
import { GameContext } from '../../interfaces';
import { PlayerService } from '../../player/player.service';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

export class DreamAmuletTrinket extends Trinket {
    @Prop({ default: 35 })
    trinketId: number;

    @Prop({ default: 'Dream Amulet' })
    name: string;

    @Prop({ default: 'Draw 1 extra card each turn' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Rare })
    rarity: TrinketRarityEnum;

    onAttach(ctx: GameContext): void {
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
                    effect: drawCardEffect.name,
                    args: {
                        value: 1,
                    },
                },
            });

            this.trigger(ctx);
        });
    }
}
