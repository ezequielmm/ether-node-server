import { EffectService } from 'src/game/effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { imbued } from './constants';
import { PlayerService } from 'src/game/components/player/player.service';
import { OnEvent } from '@nestjs/event-emitter';
import { GameContext } from 'src/game/components/interfaces';
import { EVENT_AFTER_CARD_PLAY } from 'src/game/constants';

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
                ctx: ctx,
                statuses,
                source,
                targetId,
            });
        }
    }

    @OnEvent(EVENT_AFTER_CARD_PLAY)
    async onPlayerTurnStart({ ctx }: { ctx: GameContext }): Promise<void> {

        console.log("IMBUED - EVENT_AFTER_CARD_PLAYED------------------------------------------------------------------------")

        const player = this.playerService.get(ctx);
        const {
            value: {
                combatState: { statuses },
            },
        } = player;

        await this.statusService.decreaseCounterAndRemove(
            ctx,
            statuses,
            player,
            imbued,
        );
    }
}



