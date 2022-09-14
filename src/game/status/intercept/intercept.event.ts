import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { filter } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { Context, ExpeditionEntity } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    EVENT_BEFORE_ENEMIES_TURN_START,
    EVENT_BEFORE_PLAYER_TURN_START,
} from 'src/game/constants';
import { StatusCollection } from '../interfaces';
import { StatusService } from '../status.service';
import { intercept } from './constants';

@Injectable()
export class InterceptEvent {
    private readonly logger = new Logger(InterceptEvent.name);

    constructor(
        private readonly statusService: StatusService,
        private readonly enemyService: EnemyService,
        private readonly playerService: PlayerService,
    ) {}

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_START, { async: true })
    async onEnemiesTurnStart(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            await this.updateIntercepts(ctx, enemy.value.statuses, enemy);
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_START, { async: true })
    async onPlayerTurnStart(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
        const player = this.playerService.get(ctx);
        const {
            value: {
                combatState: { statuses },
            },
        } = player;

        await this.updateIntercepts(ctx, statuses, player);
    }

    private async updateIntercepts(
        ctx: Context,
        collection: StatusCollection,
        entity: ExpeditionEntity,
    ): Promise<void> {
        const intercepts = filter(collection[intercept.type], {
            name: intercept.name,
        });

        const interceptsToRemove = [];

        if (intercepts.length === 0) return;

        for (const status of intercepts) {
            status.args.value--;

            if (status.args.value === 0) {
                interceptsToRemove.push(status);
                this.logger.debug(`Removing status ${status.name}`);
            } else {
                this.logger.debug(
                    `Decreasing intercept status value to ${status.args.value}`,
                );
            }
        }

        collection.buff = collection.buff.filter(
            (status) => !interceptsToRemove.includes(status),
        );

        await this.statusService.updateStatuses(
            entity,
            ctx.expedition,
            collection,
        );
    }
}
