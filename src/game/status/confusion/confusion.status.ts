import { Injectable, Logger } from '@nestjs/common';
import { filter, set } from 'lodash';
import { CardTargetedEnum } from 'src/game/components/card/card.enum';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { Context, ExpeditionEntity } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    JsonStatus,
    StatusCollection,
    StatusEffectDTO,
    StatusEffectHandler,
} from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { confusion } from './constants';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_BEFORE_ENEMIES_TURN_END } from 'src/game/constants';
import { EffectDTO } from 'src/game/effects/effects.interface';
import { StatusService } from '../status.service';

@StatusDecorator({
    status: confusion,
})
@Injectable()
export class ConfusionStatus implements StatusEffectHandler {
    private readonly logger = new Logger(ConfusionStatus.name);
    constructor(
        private readonly enemyService: EnemyService,
        private readonly playerService: PlayerService,
        private readonly statusService: StatusService,
    ) {}

    async preview(args: StatusEffectDTO): Promise<EffectDTO> {
        return args.effectDTO;
    }

    async handle(dto: StatusEffectDTO): Promise<EffectDTO> {
        const {
            effectDTO: { source, target },
            ctx,
        } = dto;

        let newTarget: ExpeditionEntity;

        if (PlayerService.isPlayer(target)) {
            newTarget = this.enemyService.getRandom(ctx);
        } else if (EnemyService.isEnemy(target)) {
            newTarget = this.playerService.get(ctx);
        }

        // Set using lodash to avoid typescript readonly error
        // This change is unique to this status
        set(dto.effectDTO, 'target', newTarget);

        // Confuse statuses
        // NOTE: This is a in memory change, it is not necessary to save the expedition
        this.confuseStatuses(source);

        return dto.effectDTO;
    }

    private confuseStatuses(source: ExpeditionEntity) {
        let statuses: JsonStatus[] = [];
        if (EnemyService.isEnemy(source)) {
            statuses = source.value.currentScript.intentions.flatMap(
                (intention) => intention.status || [],
            );
        } else if (PlayerService.isPlayer(source)) {
            statuses = source.value.combatState.cards.hand.flatMap(
                (card) => card.properties.statuses,
            );
        }

        statuses.forEach((status) => {
            switch (status.args.attachTo) {
                case (CardTargetedEnum.Enemy,
                CardTargetedEnum.RandomEnemy,
                CardTargetedEnum.AllEnemies):
                    status.args.attachTo = CardTargetedEnum.Player;
                    break;

                case CardTargetedEnum.Player:
                    status.args.attachTo = CardTargetedEnum.RandomEnemy;
                    break;
                case CardTargetedEnum.Self:
                    status.args.attachTo =
                        source.type == CardTargetedEnum.Player
                            ? CardTargetedEnum.RandomEnemy
                            : CardTargetedEnum.Player;
                    break;
            }
        });
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_END, { async: true })
    async onEnemiesTurnStart(args: { ctx: Context }): Promise<void> {
        const { ctx } = args;
        const enemies = this.enemyService.getAll(ctx);

        for (const enemy of enemies) {
            await this.remove(ctx, enemy.value.statuses, enemy);
        }
    }

    @OnEvent(EVENT_BEFORE_ENEMIES_TURN_END, { async: true })
    async onPlayerTurnStart(args: { ctx: Context }): Promise<void> {
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
        const confusions = filter(collection[confusion.type], {
            name: confusion.name,
        });

        const confusionsToRemove = [];

        // If there are no distraughts, return
        if (confusions.length === 0) return;

        for (const status of confusions) {
            // Decremement the value of the status
            status.args.value--;

            if (status.args.value === 0) {
                // If the value is 0, remove the status
                confusionsToRemove.push(status);
                this.logger.debug(`Removing status ${status.name}`);
            } else {
                this.logger.debug(
                    `Decreasing distraught status value to ${status.args.value}`,
                );
            }
        }

        // Remove the distraughts that are 0
        collection.debuff = collection.debuff.filter(
            (status) => !confusionsToRemove.includes(status),
        );

        // Update the entity
        await this.statusService.updateStatuses(
            entity,
            ctx.expedition,
            collection,
        );
    }
}
