import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { isEqual, reject } from 'lodash';
import { GameContext } from 'src/game/components/interfaces';
import { EVENT_BEFORE_PLAYER_TURN_END } from 'src/game/constants';
import { StatusService } from 'src/game/status/status.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { bolstered } from './constants';
import { EffectService } from 'src/game/effects/effects.service';
import { defenseEffect } from 'src/game/effects/defense/constants';

@StatusDecorator({
    status: bolstered,
})
@Injectable()
export class BolsteredStatus implements StatusEventHandler {
    private readonly logger: Logger = new Logger(BolsteredStatus.name);
    constructor(
        private readonly statusService: StatusService,
        private readonly effectService: EffectService
    ) {}

    async handle(args: StatusEventDTO): Promise<void> {
        const { source, target, ctx,
            status: {
                args: { counter: value },
            },
        } = args;

        await this.effectService.apply({
            ctx,
            source,
            target,
            effect: {
                effect: defenseEffect.name,
                args: {
                    value,
                },
            },
        });
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_END)
    async remove(args: { ctx: GameContext }): Promise<void> {
        const { ctx } = args;
        const statuses = this.statusService.getAllByName(ctx, bolstered.name);

        for (const status of statuses) {
            const buffStatuses = reject(status.statuses.buff, {
                name: bolstered.name,
            });

            if (isEqual(buffStatuses, status.statuses.buff)) {
                continue;
            }

            status.statuses.buff = buffStatuses;

            // Update status collection
            this.logger.log(
                ctx.info,
                `Removing status 'bolstered' from ${status.target.type}`,
            );

            await this.statusService.updateStatuses(
                ctx,
                status.target,
                status.statuses,
            );
        }
    }
}
