import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { isEqual, reject } from 'lodash';
import { Context } from 'src/game/components/interfaces';
import { EVENT_BEFORE_PLAYER_TURN_END } from 'src/game/constants';
import { DefenseArgs } from '../../effects/defense/defense.effect';
import { EffectDTO } from '../../effects/effects.interface';
import { StatusEffectHandler, StatusEffectDTO } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { turtling } from './constants';

@StatusDecorator({
    status: turtling,
})
export class TurtlingStatus implements StatusEffectHandler {
    private readonly logger = new Logger(TurtlingStatus.name);

    constructor(private readonly statusService: StatusService) {}

    async preview(
        args: StatusEffectDTO<DefenseArgs>,
    ): Promise<EffectDTO<DefenseArgs>> {
        return this.handle(args);
    }

    async handle(
        dto: StatusEffectDTO<DefenseArgs>,
    ): Promise<EffectDTO<DefenseArgs>> {
        dto.effectDTO.args.currentValue *= 2;
        return dto.effectDTO;
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_END, { async: true })
    async onPlayerTurnEnd(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
        const statuses = this.statusService.getAllByName(ctx, turtling.name);

        for (const status of statuses) {
            const buffStatuses = reject(status.statuses.buff, {
                name: turtling.name,
                addedInRound: ctx.expedition.currentNode.data.round - 1,
            });

            if (isEqual(buffStatuses, status.statuses.buff)) {
                continue;
            }

            status.statuses.buff = buffStatuses;

            // Update status collection
            this.logger.debug(
                `Removing status ${turtling.name} from ${status.target.type}`,
            );

            await this.statusService.updateStatuses(
                status.target,
                ctx.expedition,
                status.statuses,
            );
        }
    }
}
