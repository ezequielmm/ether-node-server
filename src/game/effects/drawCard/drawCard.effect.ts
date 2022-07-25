import { Injectable } from '@nestjs/common';
import { drawCardEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { DrawCardAction } from 'src/game/action/drawCard.action';
import { EnemyIntentionType } from 'src/game/components/enemy/enemy.enum';
import { CardTypeEnum } from 'src/game/components/card/card.enum';
import { SWARMessageType } from 'src/game/standardResponse/standardResponse';

export interface DrawCardArgs {
    useAttackingEnemies: true;
}

@EffectDecorator({
    effect: drawCardEffect,
})
@Injectable()
export class DrawCardEffect implements EffectHandler {
    constructor(private readonly drawCardAction: DrawCardAction) {}

    async handle(payload: EffectDTO<DrawCardArgs>): Promise<void> {
        const {
            client,
            args: { currentValue, useAttackingEnemies },
            expedition,
        } = payload;

        // Set the amount of cards to take
        let amountToTake = currentValue;

        // If we use the enemies that are attacking the player
        // se set this boolean value
        const useAttackingEnemiesAsValue =
            useAttackingEnemies !== undefined && useAttackingEnemies;

        if (useAttackingEnemiesAsValue) {
            // If we have a condition to modify the amount of cards to take based
            // on the enemies that are attacking the player

            // First, we deestructure the expedition to get the enemies
            const {
                currentNode: {
                    data: { enemies },
                },
            } = expedition;

            // Set initial enemies variable in 0
            let enemiesAttacking = 0;

            // Check if there are any enemies with
            // attacking intentions, if there are, increase the
            // enemiesAttacking variable by one
            enemies.forEach(({ currentScript: { intentions } }) => {
                intentions.forEach(({ type }) => {
                    if (type === EnemyIntentionType.Attack) enemiesAttacking++;
                });
            });

            amountToTake += enemiesAttacking;
        }

        await this.drawCardAction.handle({
            client,
            amountToTake,
            ...(useAttackingEnemiesAsValue && {
                cardType: CardTypeEnum.Defend,
            }),
            SWARMessageTypeToSend: SWARMessageType.PlayerAffected,
        });
    }
}
