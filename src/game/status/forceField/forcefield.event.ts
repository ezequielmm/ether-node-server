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
import { forceField } from './contants';

@Injectable()
export class ForceFieldEvent {
    private readonly logger = new Logger(ForceFieldEvent.name);

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
            await this.updateForceFields(ctx, enemy.value.statuses, enemy);
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_START, { async: true })
    async onPlayerTurnEnd(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
        const player = this.playerService.get(ctx);
        const statuses = player.value.combatState.statuses;

        await this.updateForceFields(ctx, statuses, player);
    }

    private async updateForceFields(
        ctx: Context,
        collection: StatusCollection,
        entity: ExpeditionEntity,
    ): Promise<void> {
        const forceFields = filter(collection.buff, { name: forceField.name });

        const forceFieldsToRemove = [];

        if (forceFields.length === 0) return;

        for (const status of forceFields) {
            status.args.value--;

            if (status.args.value === 0) {
                forceFieldsToRemove.push(status);
                this.logger.debug(`Removing status ${status.name}`);
            } else {
                this.logger.debug(
                    `Decreasing force field status value to ${status.args.value}`,
                );
            }
        }

        collection.buff = collection.buff.filter(
            (status) => !forceFieldsToRemove.includes(status),
        );

        // Update the entity
        await this.statusService.updateStatuses(
            entity,
            ctx.expedition,
            collection,
        );
    }
}
