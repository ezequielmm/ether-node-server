import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { isEqual, reject } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { Context } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { EVENT_BEFORE_PLAYER_TURN_END } from 'src/game/constants';
import { StatusService } from 'src/game/status/status.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { bolstered } from './constants';

@StatusDecorator({
    status: bolstered,
})
@Injectable()
export class BolsteredStatus implements StatusEventHandler {
    private readonly logger: Logger = new Logger(BolsteredStatus.name);
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly statusService: StatusService,
    ) {}

    async onEnemiesTurnStart(args: StatusEventDTO): Promise<void> {
        const {
            target,
            ctx,
            status: {
                args: { value },
            },
        } = args;

        if (PlayerService.isPlayer(target)) {
            await this.playerService.setDefense(
                ctx,
                target.value.combatState.defense + value,
            );
        } else if (EnemyService.isEnemy(target)) {
            await this.enemyService.setDefense(
                ctx,
                target.value.id,
                target.value.defense + value,
            );
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_END, { async: true })
    async remove(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
        const statuses = this.statusService.getAllByName(ctx, bolstered.name);

        for (const status of statuses) {
            const buffStatuses = reject(status.statuses.buff, {
                name: bolstered.name,
                addedInRound: ctx.expedition.currentNode.data.round - 1,
            });

            if (isEqual(buffStatuses, status.statuses.buff)) {
                continue;
            }

            status.statuses.buff = buffStatuses;

            // Update status collection
            this.logger.debug(
                `Removing status 'bolstered' from ${status.target.type}`,
            );

            await this.statusService.updateStatuses(
                status.target,
                ctx.expedition,
                status.statuses,
            );
        }
    }
}
