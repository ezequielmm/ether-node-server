import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EnemyIntentionType } from '../../components/enemy/enemy.enum';
import { ExpeditionService } from '../../components/expedition/expedition.service';
import { defenseEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { EffectService } from '../effects.service';

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
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: EffectDTO<DefenseArgs>): Promise<void> {
        const {
            client,
            target,
            expedition: {
                currentNode: {
                    data: {
                        player: { defense: currentDefense },
                    },
                },
            },
            args: {
                currentValue,
                useEnemies,
                useDiscardPileAsValue,
                multiplier,
                useAttackingEnemies,
            },
        } = payload;

        let newDefense = currentValue;

        // Apply if the player is the target
        if (EffectService.isPlayer(target)) {
            // Check if the card uses the amount of enemies as
            // value to calculate the defense amount to apply
            if (useEnemies !== undefined && useEnemies) {
                newDefense = await this.useEnemiesAsValue(client, currentValue);
            }

            // Check if the card uses the amount of cards from the
            // discard pile as a value to set the defense
            if (useDiscardPileAsValue !== undefined && useDiscardPileAsValue) {
                newDefense = await this.useDiscardPileAsValue(
                    client,
                    currentValue,
                    multiplier,
                );
            }

            // Check if the card uses the enemies that are attacking next turn as
            // value to calculate the defense amount to apply
            if (useAttackingEnemies !== undefined && useAttackingEnemies) {
                newDefense = await this.useEnemiesAttackingAsValue(
                    client,
                    currentValue,
                );
            }

            newDefense = newDefense + currentDefense;

            await this.expeditionService.setPlayerDefense({
                clientId: client.id,
                value: newDefense,
            });
        }

        // Apply if the enemy is the target
        if (EffectService.isEnemy(target)) {
            newDefense = newDefense + currentDefense;

            await this.expeditionService.setEnemyDefense(
                client.id,
                target.value.id,
                newDefense,
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
