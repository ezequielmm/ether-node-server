import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EnemyIntentionType } from '../../components/enemy/enemy.enum';
import { ExpeditionService } from '../../components/expedition/expedition.service';
import { defenseEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { isNotUndefined } from 'src/utils';
import { PlayerService } from 'src/game/components/player/player.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import {
    CombatQueueTargetEffectTypeEnum,
    CombatQueueTargetTypeEnum,
} from 'src/game/components/combatQueue/combatQueue.enum';
import { ICombatQueueTarget } from 'src/game/components/combatQueue/combatQueue.interface';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';

export interface DefenseArgs {
    useEnemies: boolean;
    useDiscardPileAsValue: boolean;
    useAttackingEnemies: boolean;
    multiplier: number;
}

@EffectDecorator({
    effect: defenseEffect,
})
@Injectable()
export class DefenseEffect implements EffectHandler {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly combatQueueService: CombatQueueService,
    ) {}

    async handle(payload: EffectDTO<DefenseArgs>): Promise<void> {
        const {
            ctx,
            target,
            args: {
                currentValue,
                useEnemies,
                useDiscardPileAsValue,
                multiplier,
                useAttackingEnemies,
            },
            combatQueueId,
        } = payload;
        const {
            client,
            expedition: {
                currentNode: {
                    data: {
                        player: { defense: currentDefense },
                    },
                },
            },
        } = ctx;

        let newDefense = currentValue;

        // Apply if the player is the target
        if (PlayerService.isPlayer(target)) {
            // Check if the card uses the amount of enemies as
            // value to calculate the defense amount to apply
            if (isNotUndefined(useEnemies))
                newDefense = await this.useEnemiesAsValue(client, currentValue);

            // Check if the card uses the amount of cards from the
            // discard pile as a value to set the defense
            if (isNotUndefined(useDiscardPileAsValue))
                newDefense = await this.useDiscardPileAsValue(
                    client,
                    currentValue,
                    multiplier,
                );

            // Check if the card uses the enemies that are attacking next turn as
            // value to calculate the defense amount to apply
            if (isNotUndefined(useAttackingEnemies))
                newDefense = await this.useEnemiesAttackingAsValue(
                    client,
                    currentValue,
                );

            const {
                value: {
                    globalState: { playerId },
                },
            } = target;

            const defenseCalculated = newDefense + currentDefense;

            // Here we create the target for the combat queue
            const combatQueueTarget: ICombatQueueTarget = {
                effectType: CombatQueueTargetEffectTypeEnum.Defense,
                targetType: CombatQueueTargetTypeEnum.Player,
                targetId: playerId,
                defenseDelta: newDefense,
                finalDefense: defenseCalculated,
                healthDelta: 0,
                finalHealth: 0,
                statuses: [],
            };

            await this.playerService.setDefense(ctx, defenseCalculated);

            await this.combatQueueService.addTargetsToCombatQueue(
                combatQueueId,
                [combatQueueTarget],
            );
        }

        // Apply if the enemy is the target
        if (EnemyService.isEnemy(target)) {
            const {
                value: { id },
            } = target;

            const defenseCalculated = newDefense + currentDefense;

            // Here we create the target for the combat queue
            const combatQueueTarget: ICombatQueueTarget = {
                effectType: CombatQueueTargetEffectTypeEnum.Defense,
                targetType: CombatQueueTargetTypeEnum.Enemy,
                targetId: id,
                defenseDelta: newDefense,
                finalDefense: defenseCalculated,
                healthDelta: 0,
                finalHealth: 0,
                statuses: [],
            };

            await this.enemyService.setDefense(
                ctx,
                target.value.id,
                defenseCalculated,
            );

            await this.combatQueueService.addTargetsToCombatQueue(
                combatQueueId,
                [combatQueueTarget],
            );
        }
    }

    private async useEnemiesAsValue(
        client: Socket,
        currentValue: number,
    ): Promise<number> {
        const {
            data: { enemies },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        return currentValue * enemies.length;
    }

    private async useDiscardPileAsValue(
        client: Socket,
        currentValue: number,
        multiplier: number,
    ): Promise<number> {
        const {
            data: {
                player: {
                    cards: { discard },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        const discardAmount = discard.length;

        return currentValue + discardAmount * multiplier;
    }

    private async useEnemiesAttackingAsValue(
        client: Socket,
        currentValue: number,
    ): Promise<number> {
        const {
            data: { enemies },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        let newDefense = currentValue;
        let multiplier = 0;

        enemies.forEach(({ currentScript: { intentions } }) => {
            intentions.forEach(({ type }) => {
                if (type === EnemyIntentionType.Attack) multiplier += 1;
            });
        });

        newDefense *= multiplier;

        return newDefense;
    }
}
