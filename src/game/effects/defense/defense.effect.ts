import { Injectable } from '@nestjs/common';
import { EnemyIntentionType } from '../../components/enemy/enemy.enum';
import { defenseEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { isNotUndefined } from 'src/utils';
import { PlayerService } from 'src/game/components/player/player.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import {
    CombatQueueTargetEffectTypeEnum,
    CombatQueueTargetTypeEnum,
} from 'src/game/components/combatQueue/combatQueue.enum';
import { ICombatQueueTarget } from 'src/game/components/combatQueue/combatQueue.interface';

export interface DefenseArgs {
    useEnemies: boolean;
    multiplier?: number;
    useDiscardPileAsValue: boolean;
    useAttackingEnemies: boolean;
}

@EffectDecorator({
    effect: defenseEffect,
})
@Injectable()
export class DefenseEffect implements EffectHandler {
    constructor(
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

        let newDefense = currentValue;

        // Apply if the player is the target
        if (PlayerService.isPlayer(target)) {
            const { expedition } = ctx;

            // Get the current defense value from the player
            const {
                value: {
                    combatState: { defense: currentDefense },
                    globalState: { playerId },
                },
            } = target;

            // Check if the card uses the amount of enemies as
            // value to calculate the defense amount to apply
            if (isNotUndefined(useEnemies)) {
                const {
                    currentNode: {
                        data: { enemies },
                    },
                } = expedition;

                newDefense *= enemies.length;
            }

            // Check if the card uses the amount of cards from the
            // discard pile as a value to set the defense
            if (isNotUndefined(useDiscardPileAsValue)) {
                const {
                    currentNode: {
                        data: {
                            player: {
                                cards: { discard },
                            },
                        },
                    },
                } = expedition;

                newDefense = newDefense * discard.length * multiplier;
            }

            // Check if the card uses the enemies that are attacking next turn as
            // value to calculate the defense amount to apply
            if (isNotUndefined(useAttackingEnemies)) {
                const {
                    currentNode: {
                        data: { enemies },
                    },
                } = expedition;

                let enemiesAttacking = 0;

                enemies.forEach(({ currentScript: { intentions } }) => {
                    intentions.forEach(({ type }) => {
                        if (type === EnemyIntentionType.Attack)
                            enemiesAttacking++;
                    });
                });

                newDefense *= enemiesAttacking;
            }

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
            // Get the current defense value from the enemy
            const {
                value: { defense: currentDefense, id },
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
                newDefense,
            );

            await this.combatQueueService.addTargetsToCombatQueue(
                combatQueueId,
                [combatQueueTarget],
            );
        }
    }
}
