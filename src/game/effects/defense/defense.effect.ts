import { Injectable } from '@nestjs/common';
import { EnemyIntentionType } from '../../components/enemy/enemy.enum';
import { defenseEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { isNotUndefined } from 'src/utils';
import { PlayerService } from 'src/game/components/player/player.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';

export interface DefenseArgs {
    useEnemies: boolean;
    multiplier?: number;
    useDiscardPileAsValue: boolean;
    useAttackingEnemies: boolean;
    useEnergyAsMultiplier: boolean;
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
            source,
            target,
            args: {
                currentValue,
                useEnemies,
                useDiscardPileAsValue,
                multiplier,
                useAttackingEnemies,
                useEnergyAsMultiplier,
            },
        } = payload;

        let newDefense = currentValue;

        // Apply if the player is the target
        if (PlayerService.isPlayer(target)) {
            const { expedition } = ctx;

            // Get the current defense value from the player
            const {
                value: {
                    combatState: { defense: currentDefense },
                },
            } = target;

            // Check if the card uses the amount of enemies alive as
            // value to calculate the defense amount to apply
            if (isNotUndefined(useEnemies)) {
                const {
                    currentNode: {
                        data: { enemies },
                    },
                } = expedition;

                // Now we remove the enemies that are defeated
                // hpCurrent = 0
                const enemiesAlive = enemies.filter(({ hpCurrent }) => {
                    return hpCurrent > 0;
                });

                newDefense *= enemiesAlive.length;
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

            // Here we check if the card uses the energy available for the player
            // and use as multipler for the defense
            if (isNotUndefined(useEnergyAsMultiplier)) {
                const {
                    currentNode: {
                        data: {
                            player: { energy },
                        },
                    },
                } = expedition;

                newDefense *= energy;
            }

            const defenseCalculated = newDefense + currentDefense;

            await this.playerService.setDefense(ctx, defenseCalculated);

            await this.combatQueueService.push({
                ctx,
                source,
                target,
                args: {
                    effectType: CombatQueueTargetEffectTypeEnum.Defense,
                    defenseDelta: newDefense,
                    finalDefense: defenseCalculated,
                    healthDelta: 0,
                    finalHealth: 0,
                    statuses: [],
                },
            });
        }

        // Apply if the enemy is the target
        if (EnemyService.isEnemy(target)) {
            // Get the current defense value from the enemy
            const {
                value: { defense: currentDefense },
            } = target;

            const defenseCalculated = currentDefense + newDefense;

            await this.enemyService.setDefense(
                ctx,
                target.value.id,
                defenseCalculated,
            );

            await this.combatQueueService.push({
                ctx,
                source,
                target,
                args: {
                    effectType: CombatQueueTargetEffectTypeEnum.Defense,
                    defenseDelta: newDefense,
                    finalDefense: defenseCalculated,
                    healthDelta: 0,
                    finalHealth: 0,
                    statuses: [],
                },
            });
        }
    }
}
