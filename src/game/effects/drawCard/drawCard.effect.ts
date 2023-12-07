import { Injectable } from '@nestjs/common';
import { drawCardEffect } from './constants';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { DrawCardAction } from 'src/game/action/drawCard.action';
import { EnemyIntentionType } from 'src/game/components/enemy/enemy.enum';
import {
    CardTargetedEnum,
    CardTypeEnum,
} from 'src/game/components/card/card.enum';
import { SWARMessageType } from 'src/game/standardResponse/standardResponse';
import { isNotUndefined } from 'src/utils';
import { DiscardAllCardsAction } from 'src/game/action/discardAllCards.action';
import { DiscardCardAction } from 'src/game/action/discardCard.action';

export interface DrawCardArgs {
    useAttackingEnemies: boolean;
    useEnemiesConfusedAsCost: boolean;
    checkIfEnemyIsAttacking: boolean;
}

@EffectDecorator({
    effect: drawCardEffect,
})
@Injectable()
export class DrawCardEffect implements EffectHandler {
    constructor(private readonly drawCardAction: DrawCardAction,
        private readonly discardAllCardsAction: DiscardAllCardsAction,
        private readonly discardCardAction: DiscardCardAction,
        ) {}

    async handle(payload: EffectDTO<DrawCardArgs>): Promise<void> {
        const {
            ctx,
            target,
            args: {
                currentValue,
                useAttackingEnemies,
                useEnemiesConfusedAsCost,
                checkIfEnemyIsAttacking,
            },
        } = payload;
        const { expedition } = ctx;

        // Set the amount of cards to take
        let amountToTake = currentValue;

        // If we use the enemies that are attacking the player
        // we set this boolean value
        const useAttackingEnemiesAsValue = isNotUndefined(useAttackingEnemies);

        // If we use the enemy selected to check its intentions
        // we set this boolean value
        const useCheckEnemyIntentions = isNotUndefined(checkIfEnemyIsAttacking);

        // If we use the enemies have a confusion status
        // se set this boolean value
        const useEnemiesConfusedAsValue = isNotUndefined(
            useEnemiesConfusedAsCost,
        );

        // Here is we have to check all the enemy intentions
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

        // Here we set a variable to check if the targeted enemy
        let enemyIsAttacking = false;

        // Here we check the enemy selected to get its intentions
        if (useCheckEnemyIntentions && target.type === CardTargetedEnum.Enemy) {
            // Here we get the enemy to check the intentions
            const {
                currentScript: { intentions },
            } = target.value;

            intentions.forEach(({ type }) => {
                if (type === EnemyIntentionType.Attack) enemyIsAttacking = true;
            });
        }

        // Now we move all those cards to the discard pile
        await this.discardAllCardsAction.handle2(ctx, SWARMessageType.PlayerAffected);
        // await this.discardCardAction.handle({
        //     client: ctx.client,
        //     cardId,
        //     ctx,
        //     emit: true,
        // });

        await this.drawCardAction.handle({
            ctx,
            amountToTake,
            ...((useAttackingEnemiesAsValue || enemyIsAttacking) && {
                filterType: CardTypeEnum.Defend,
            }),
            SWARMessageTypeToSend: SWARMessageType.PlayerAffected,
            useEnemiesConfusedAsValue,
        });

        // await this.drawCardAction.handle({
        //     ctx,
        //     amountToTake: 1,
        //     filterType: undefined,
        //     SWARMessageTypeToSend: SWARMessageType.PlayerAffected,
        // });
    }
}
