import { EffectService } from 'src/game/effects/effects.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { imbued } from './constants';

@StatusDecorator({
    status: imbued,
})
export class ImbuedStatus implements StatusEventHandler {
    constructor(
        private readonly statusService: StatusService,
        private readonly effectService: EffectService,
    ) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        const { ctx, eventArgs: { card, cardSource: source, cardTargetId: targetId } } = dto;

        const { properties: { effects, statuses } } = card;

        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------")
        console.log("Card to be played twice: ")
        console.log(card)
        console.log("----------------------------------------------")

        console.log("TargetId:")
        console.log(targetId)
        console.log("----------------------------------------------")

        console.log("Effects:")
        console.log(effects)
        console.log("----------------------------------------------")

        console.log("Statuses:")
        console.log(statuses)
        console.log("----------------------------------------------")

        console.log("------------------------------------------------------------------------------------------------------------------------------------------------------")

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

        await this.statusService.decreaseCounterAndRemove(
            ctx,
            statuses,
            dto.source,
            imbued,
        );
    }
}
