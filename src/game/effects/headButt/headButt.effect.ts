import { Injectable } from '@nestjs/common';
import { confusion } from 'src/game/status/confusion/constants';
import { StatusService } from 'src/game/status/status.service';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { headButt } from './constants';

@EffectDecorator({
    effect: headButt,
})
@Injectable()
export class HeadButtEffect implements EffectHandler {
    constructor(private readonly statusService: StatusService) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { target, source, ctx } = dto;

        const { expedition } = ctx;

        const sourceReference =
            this.statusService.getReferenceFromSource(source);

        let defense;
        let targetId;

        if (EffectService.isEnemy(target)) {
            defense = target.value.defense;
            targetId = target.value.id;
        } else if (EffectService.isPlayer(target)) {
            defense = target.value.combatState.defense;
        }

        if (defense == 0) {
            await this.statusService.attach({
                ctx,
                statuses: [
                    {
                        name: confusion.name,
                        args: {
                            attachTo: target.type,
                            value: 1,
                        },
                    },
                ],
                currentRound: expedition.currentNode.data.round,
                sourceReference,
                targetId,
            });
        }
    }
}
