import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { filter } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { Context, ExpeditionEntity } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    EVENT_BEFORE_ENEMIES_TURN_END,
    EVENT_BEFORE_PLAYER_TURN_END,
} from 'src/game/constants';
import { DamageArgs } from '../../effects/damage/damage.effect';
import { EffectDTO } from '../../effects/effects.interface';
import {
    StatusEffectHandler,
    StatusEffectDTO,
    StatusCollection,
} from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { StatusService } from '../status.service';
import { heraldDelayed } from './constants';

@StatusDecorator({
    status: heraldDelayed,
})
@Injectable()
export class HeraldDelayedStatus implements StatusEffectHandler {
    protected readonly logger = new Logger(HeraldDelayedStatus.name);

    constructor(
        protected readonly playerService: PlayerService,
        protected readonly enemyService: EnemyService,
        protected readonly statusService: StatusService,
    ) {}

    async preview(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        return this.handle(args);
    }

    async handle(
        args: StatusEffectDTO<DamageArgs>,
    ): Promise<EffectDTO<DamageArgs>> {
        args.effectDTO.args.currentValue *= 2;
        return args.effectDTO;
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_END, { async: true })
    async onEnemiesTurnEnd(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            await this.remove(ctx, enemy.value.statuses, enemy);
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_END, { async: true })
    async onPlayerTurnEnd(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
        const player = this.playerService.get(ctx);
        const statuses = player.value.combatState.statuses;

        await this.remove(ctx, statuses, player);
    }

    private async remove(
        ctx: Context,
        collection: StatusCollection,
        entity: ExpeditionEntity,
    ): Promise<void> {
        const heraldDelayedCollection = filter(collection[heraldDelayed.type], {
            name: heraldDelayed.name,
        });

        const distraughtsToRemove = [];

        // If there are no distraughts, return
        if (heraldDelayedCollection.length === 0) return;

        for (const status of heraldDelayedCollection) {
            // Decremement the value of the status
            status.args.value--;

            if (status.args.value === 0) {
                // If the value is 0, remove the status
                distraughtsToRemove.push(status);
                this.logger.debug(`Removing status ${status.name}`);
            } else {
                this.logger.debug(
                    `Decreasing distraught status value to ${status.args.value}`,
                );
            }
        }

        // Remove the distraughts that are 0
        collection.debuff = collection.debuff.filter(
            (status) => !distraughtsToRemove.includes(status),
        );

        // Update the entity
        await this.statusService.updateStatuses(
            entity,
            ctx.expedition,
            collection,
        );
    }
}
