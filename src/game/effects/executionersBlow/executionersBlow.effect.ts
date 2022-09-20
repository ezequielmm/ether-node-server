import { MoveCardAction } from 'src/game/action/moveCard.action';
import { CardSelectionScreenOriginPileEnum } from 'src/game/components/cardSelectionScreen/cardSelectionScreen.enum';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { HistoryService } from 'src/game/history/history.service';
import { CardRegistry } from 'src/game/history/interfaces';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { executionersBlowEffect } from './contants';

@EffectDecorator({
    effect: executionersBlowEffect,
})
export class ExecutionersBlowEffect implements EffectHandler {
    constructor(
        private readonly enemyService: EnemyService,
        private readonly historyService: HistoryService,
        private readonly moveCardAction: MoveCardAction,
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const {
            ctx: { client },
            target,
        } = dto;

        // First we check if the target is an enemy and if the
        // target is dead
        if (EnemyService.isEnemy(target) && this.enemyService.isDead(target)) {
            // if the enemy is dead we move the card we just played back to
            // the hand with cost 0

            // We query the card from the registry
            const { card } = this.historyService.findLast(client.id, {
                type: 'card',
            }) as CardRegistry;

            // Now we move that card to the hand pile
            await this.moveCardAction.handle({
                client,
                cardIds: [card.id],
                originPile: CardSelectionScreenOriginPileEnum.Discard,
                cardIsFree: true,
            });
        }
    }
}
