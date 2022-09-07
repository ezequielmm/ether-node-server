import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { filter } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { Context, ExpeditionEntity } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    EVENT_BEFORE_ENEMIES_TURN_START,
    EVENT_BEFORE_ENEMIES_TURN_END,
    EVENT_BEFORE_PLAYER_TURN_END,
} from 'src/game/constants';
import { DefenseArgs } from '../../effects/defense/defense.effect';
import { EffectDTO } from '../../effects/effects.interface';
import {
    StatusEffectHandler,
    StatusEffectDTO,
    StatusCollection,
} from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { turtling } from './constants';

@StatusDecorator({
    status: turtling,
})
export class TurtlingStatus implements StatusEffectHandler {
    private readonly logger = new Logger(TurtlingStatus.name);

    constructor(
        private readonly statusService: StatusService,
        private readonly enemyService: EnemyService,
        private readonly playerService: PlayerService,
    ) {}

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

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_END, { async: true })
    async onEnemiesTurnEnd(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            await this.updateStatuses(ctx, enemy.value.statuses, enemy);
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_END, { async: true })
    async onPlayerTurnEnd(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
        const player = this.playerService.get(ctx);
        const statuses = player.value.combatState.statuses;

        await this.updateStatuses(ctx, statuses, player);
    }

    private async updateStatuses(
        ctx: Context,
        collection: StatusCollection,
        entity: ExpeditionEntity,
    ): Promise<void> {
        const statuses = filter(collection.buff, { name: turtling.name });

        const statusesToRemove = [];

        if (statuses.length === 0) return;

        for (const status of statuses) {
            const isActive = this.statusService.isActive(
                turtling.startsAt,
                status.addedInRound,
                ctx.expedition.currentNode.data.round,
            );

            if (!isActive) continue;

            status.args.value--;

            if (status.args.value === 0) {
                statusesToRemove.push(status);
                this.logger.debug(`Removing status ${status.name}`);
            } else {
                this.logger.debug(
                    `Decreasing ${turtling.name} status value to ${status.args.value}`,
                );
            }
        }

        collection.buff = collection.buff.filter(
            (status) => !statusesToRemove.includes(status),
        );

        // Update the entity
        await this.statusService.updateStatuses(
            entity,
            ctx.expedition,
            collection,
        );
    }
}
