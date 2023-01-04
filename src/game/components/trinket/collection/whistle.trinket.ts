import { Prop } from '@typegoose/typegoose';
import { EVENT_AFTER_PLAYER_TURN_START } from 'src/game/constants';
import { attachStatusEffect } from 'src/game/effects/attachStatus/constants';
import { EffectService } from 'src/game/effects/effects.service';
import { GameEvent } from 'src/game/interfaces';
import { fortitude } from 'src/game/status/fortitude/constants';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { GameContext } from '../../interfaces';
import { PlayerService } from '../../player/player.service';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

/**
 * Whistle Trinket
 */
export class WhistleTrinket extends Trinket {
    @Prop({ default: 25 })
    trinketId: number;

    @Prop({ default: 'Whistle' })
    name: string;

    @Prop({
        default:
            'At the start of the 3rd combat turn, gain 1 Resolve and 1 Fortitude',
    })
    description: string;

    @Prop({ default: TrinketRarityEnum.Common })
    rarity: TrinketRarityEnum;

    @Prop({ default: 1 })
    resolveToAdd: number;

    @Prop({ default: 1 })
    fortitudeToAdd: number;

    onAttach(ctx: GameContext): void {
        ctx.events.addListener(
            EVENT_AFTER_PLAYER_TURN_START,
            async (event: GameEvent) => {
                if (event.ctx.expedition.currentNode.data.round !== 2) {
                    return;
                }

                const opts = { strict: false };

                const playerService = ctx.moduleRef.get(PlayerService, opts);
                const effectService = ctx.moduleRef.get(EffectService, opts);

                const player = playerService.get(ctx);

                this.trigger(ctx);

                await effectService.apply({
                    ctx,
                    source: player,
                    target: player,
                    effect: {
                        effect: attachStatusEffect.name,
                        args: {
                            statusName: resolveStatus.name,
                            statusArgs: {
                                counter: this.resolveToAdd,
                            },
                        },
                    },
                });

                await effectService.apply({
                    ctx,
                    source: player,
                    target: player,
                    effect: {
                        effect: attachStatusEffect.name,
                        args: {
                            statusName: fortitude.name,
                            statusArgs: {
                                counter: this.fortitudeToAdd,
                            },
                        },
                    },
                });
            },
        );
    }
}
