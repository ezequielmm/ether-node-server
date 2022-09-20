import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GetEnergyAction } from 'src/game/action/getEnergy.action';
import { MoveCardAction } from 'src/game/action/moveCard.action';
import { CardSelectionScreenOriginPileEnum } from 'src/game/components/cardSelectionScreen/cardSelectionScreen.enum';
import { CombatQueueTargetEffectTypeEnum } from 'src/game/components/combatQueue/combatQueue.enum';
import { CombatQueueService } from 'src/game/components/combatQueue/combatQueue.service';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { PlayerService } from 'src/game/components/player/player.service';
import { EVENT_AFTER_DAMAGE_EFFECT } from 'src/game/constants';
import { HistoryService } from 'src/game/history/history.service';
import { CardRegistry } from 'src/game/history/interfaces';
import { isNotUndefined } from 'src/utils';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';
import { energyEffect } from '../energy/constants';
import { damageEffect } from './constants';

export interface DamageArgs {
    useDefense?: boolean;
    multiplier?: number;
    useEnergyAsValue?: boolean;
    useEnergyAsMultiplier?: boolean;
    onARoll?: {
        energyToRestore: number;
    };
    returnCardIfEnemyIsDefeated: boolean;
}

@EffectDecorator({
    effect: damageEffect,
})
@Injectable()
export class DamageEffect implements EffectHandler {
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly eventEmitter: EventEmitter2,
        private readonly combatQueueService: CombatQueueService,
        private readonly effectService: EffectService,
        private readonly getEnergyAction: GetEnergyAction,
        private readonly moveCardAction: MoveCardAction,
        private readonly historyService: HistoryService,
    ) {}

    async handle(payload: EffectDTO<DamageArgs>): Promise<void> {
        const {
            ctx,
            source,
            target,
            args: {
                currentValue,
                useDefense,
                multiplier,
                useEnergyAsMultiplier,
                useEnergyAsValue,
                onARoll,
                returnCardIfEnemyIsDefeated,
            },
        } = payload;

        const {
            value: {
                combatState: { energy, defense },
            },
        } = this.playerService.get(ctx);

        let oldHp = 0;
        let newHp = 0;
        let oldDefense = 0;
        let newDefense = 0;

        // Check targeted type
        if (EnemyService.isEnemy(target)) {
            // First we check if we have to deal a multiplier
            // using the remaining energy of the player
            const damage =
                currentValue *
                (useEnergyAsMultiplier ? energy : 1) *
                (useDefense ? multiplier * defense : 1);

            oldHp = target.value.hpCurrent;
            oldDefense = target.value.defense;

            await this.enemyService.damage(ctx, target.value.id, damage);

            newHp = target.value.hpCurrent;
            newDefense = target.value.defense;

            // Here we check if the enemy was defeated to run the on a roll
            // effect only if the enemy's health is 0
            if (newHp == 0) {
                if (onARoll && onARoll.energyToRestore) {
                    await this.effectService.apply({
                        ctx,
                        source: source,
                        target: source,
                        effect: {
                            effect: energyEffect.name,
                            target: source.type,
                            args: {
                                value: onARoll.energyToRestore,
                            },
                        },
                    });

                    await this.getEnergyAction.handle(ctx.client.id);
                }

                // If the enemy is defeated, we send back executioners blow
                // back to the hand
                if (isNotUndefined(returnCardIfEnemyIsDefeated)) {
                    const { card } = this.historyService.findLast(
                        ctx.client.id,
                        {
                            type: 'card',
                        },
                    ) as CardRegistry;

                    console.log({ card });

                    await this.moveCardAction.handle({
                        client: ctx.client,
                        cardIds: [card.id],
                        originPile: CardSelectionScreenOriginPileEnum.Discard,
                        cardIsFree: true,
                    });
                }
            }
        }

        if (PlayerService.isPlayer(target)) {
            // Here we check if we have to use the enemy available
            // as currentValue, here we just need to add it, the value
            // on the effect is 0
            const damage = isNotUndefined(useEnergyAsValue)
                ? energy
                : currentValue;

            oldHp = target.value.combatState.hpCurrent;
            oldDefense = target.value.combatState.defense;

            await this.playerService.damage(ctx, damage);

            newHp = target.value.combatState.hpCurrent;
            newDefense = target.value.combatState.defense;
        }

        // Add the damage to the combat queue
        await this.combatQueueService.push({
            ctx,
            source,
            target,
            args: {
                effectType: CombatQueueTargetEffectTypeEnum.Damage,
                healthDelta: newHp - oldHp,
                defenseDelta: newDefense - oldDefense,
                finalHealth: newHp,
                finalDefense: newDefense,
                statuses: [],
            },
        });

        await this.eventEmitter.emitAsync(EVENT_AFTER_DAMAGE_EFFECT, {
            ctx,
        });
    }
}
