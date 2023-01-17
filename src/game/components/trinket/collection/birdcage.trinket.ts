import { Prop } from '@typegoose/typegoose';
import { EVENT_AFTER_INIT_COMBAT } from 'src/game/constants';
import { birdcageStatus } from 'src/game/status/birdcage/constants';
import { StatusService } from 'src/game/status/status.service';
import { GameContext } from '../../interfaces';
import { PlayerService } from '../../player/player.service';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

/**
 * Birdcage Trinket
 */
export class BirdcageTrinket extends Trinket {
    @Prop({ default: 3 })
    trinketId: number;

    @Prop({ default: 'Birdcage' })
    name: string;

    @Prop({ default: 'Every 4th attack deals 2 more damage' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Common })
    rarity: TrinketRarityEnum;

    @Prop({ default: 2 })
    damage: number;

    async onAttach(ctx: GameContext): Promise<void> {
        ctx.events.addListener(EVENT_AFTER_INIT_COMBAT, async () => {
            const statusService = ctx.moduleRef.get(StatusService, {
                strict: false,
            });

            const playerService = ctx.moduleRef.get(PlayerService, {
                strict: false,
            });

            const player = playerService.get(ctx);

            await statusService.attach({
                ctx,
                source: player,
                target: player,
                statusName: birdcageStatus.name,
                statusArgs: {
                    counter: 4,
                    value: this.damage,
                },
            });
            this.trigger(ctx);
        });
    }
}
