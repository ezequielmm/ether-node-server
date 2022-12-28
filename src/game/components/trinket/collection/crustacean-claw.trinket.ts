import { Prop } from '@typegoose/typegoose';
import { EVENT_AFTER_INIT_COMBAT } from 'src/game/constants';
import { drawCardEffect } from 'src/game/effects/drawCard/constants';
import { EffectService } from 'src/game/effects/effects.service';
import { GameContext } from '../../interfaces';
import { PlayerService } from '../../player/player.service';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

export class CrustaceanClawTrinket extends Trinket {
    @Prop({ default: 14 })
    trinketId: number;

    @Prop({ default: `Crustacean's Claw` })
    name: string;

    @Prop({
        default:
            'At the beginning of combat, draw 1 extra card, which costs 0 this turn',
    })
    description: string;

    @Prop({ default: TrinketRarityEnum.Uncommon })
    rarity: TrinketRarityEnum;

    @Prop({ default: 1 })
    cardsToDraw: number;

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
                        value: this.cardsToDraw,
                    },
                },
            });

            // TODO: set cards cost to 0 only for one turn

            this.trigger(ctx);
        });
    }
}
