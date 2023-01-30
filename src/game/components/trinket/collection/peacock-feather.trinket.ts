import { Prop } from '@typegoose/typegoose';
import { peacockFeatherStatus } from 'src/game/status/peacockFeather/constants';
import { StatusService } from 'src/game/status/status.service';
import { GameContext } from '../../interfaces';
import { PlayerService } from '../../player/player.service';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

/**
 * Peacock Feather Trinket
 */
export class PeacockFeatherTrinket extends Trinket {
    @Prop({ default: 41 })
    trinketId: number;

    @Prop({ default: 'Peacock Feather' })
    name: string;

    @Prop({ default: 'Every 20th card played costs 0 Energy' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Rare })
    rarity: TrinketRarityEnum;

    @Prop({ default: 20 })
    counterCardPlayed: number;

    async onAttach(ctx: GameContext): Promise<void> {
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
            statusName: peacockFeatherStatus.name,
            statusArgs: {
                counter: 1,
                value: this.counterCardPlayed,
            },
        });

        this.trigger(ctx);
    }
}
