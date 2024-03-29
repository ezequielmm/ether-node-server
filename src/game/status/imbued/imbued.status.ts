import { EffectService } from 'src/game/effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { imbued } from './constants';
import { PlayerService } from 'src/game/components/player/player.service';

@StatusDecorator({
    status: imbued,
})
export class ImbuedStatus implements StatusEventHandler {
    constructor(
        private readonly statusService: StatusService,
        private readonly effectService: EffectService,
        private readonly playerService: PlayerService
    ) {}

    async handle(dto: StatusEventDTO): Promise<void> {

        const { ctx, eventArgs: { card, cardSource: source, cardTargetId: targetId } } = dto;
        const { properties: { effects, statuses } } = card;

        if(effects?.length){
            await this.effectService.applyAll({
                ctx,
                source,
                effects,
                selectedEnemy: targetId,
            });
        }

        if(statuses?.length){
            await this.statusService.attachAll({
                ctx,
                statuses,
                source,
                targetId,
            });
        }

        const player = this.playerService.get(ctx);

        await this.statusService.removeStatus({
            ctx,
            entity: player,
            status: imbued,
        });

        console.log("Card after imbued effect:")
        console.log(card.properties.statuses)
        console.log("---------------------------------------------")
    }
}


