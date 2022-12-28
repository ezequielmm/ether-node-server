import { Prop } from '@typegoose/typegoose';
import { EVENT_AFTER_INIT_COMBAT } from 'src/game/constants';
import { resolveStatus } from 'src/game/status/resolve/constants';
import { StatusService } from 'src/game/status/status.service';
import { GameContext } from '../../interfaces';
import { PlayerService } from '../../player/player.service';
import { TrinketRarityEnum } from '../trinket.enum';
import { Trinket } from '../trinket.schema';

export class PanFluteTrinket extends Trinket {
    @Prop({ default: 45 })
    trinketId: number;

    @Prop({ default: 'Pan Flute' })
    name: string;

    @Prop({ default: 'At the start of combat, gain 1 Resolve' })
    description: string;

    @Prop({ default: TrinketRarityEnum.Special })
    rarity: TrinketRarityEnum;

    @Prop({ default: 1 })
    resolveToGain: number;

    onAttach(ctx: GameContext): void {
        ctx.events.addListener(EVENT_AFTER_INIT_COMBAT, async () => {
            const playerService = ctx.moduleRef.get(PlayerService, {
                strict: false,
            });

            const statusService = ctx.moduleRef.get(StatusService, {
                strict: false,
            });

            const player = playerService.get(ctx);

            await statusService.attach({
                ctx,
                source: player,
                target: player,
                statusName: resolveStatus.name,
                statusArgs: {
                    value: this.resolveToGain,
                    counter: this.resolveToGain,
                },
            });
        });
    }
}
