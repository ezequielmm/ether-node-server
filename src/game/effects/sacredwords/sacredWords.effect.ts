import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { HistoryService } from 'src/game/history/history.service';
import { CardRegistry } from 'src/game/history/interfaces';
import { removeCardsFromPile } from 'src/utils';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { sacredWordEffect } from './constants';
import { EnemyService } from 'src/game/components/enemy/enemy.service';

@EffectDecorator({
    effect: sacredWordEffect,
})
@Injectable()
export class SacredWordEffect implements EffectHandler {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly historyService: HistoryService,
        private readonly enemyService: EnemyService,
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx } = dto;
        
        await this.enemyService.calculateNewIntentions(ctx);

        console.log("::::::::::::::::::::FUNCIONA EFECTO SACRED WORDS::::::::::::::::::");
        // // // // // // Get the card that was played by history service and move it
        // // // // // // to the draw pile
        // // // // // const card = this.historyService.findLast<CardRegistry>(ctx.client.id, {
        // // // // //     type: 'card',
        // // // // //     card: {},
        // // // // // });

        // // // // // if (!card)
        // // // // //     throw new Error('Card Autonomous Weapon not found in history');

        // // // // // const { discard, draw } = ctx.expedition.currentNode.data.player.cards;

        // // // // // // Add the card to the draw pile
        // // // // // draw.push(card.card);
        // // // // // // Remove the card from the discard pile
        // // // // // ctx.expedition.currentNode.data.player.cards.discard =
        // // // // //     removeCardsFromPile({
        // // // // //         originalPile: discard,
        // // // // //         cardsToRemove: [card.card],
        // // // // //     });

        // // // // // // Update the expedition
        // // // // // await this.expeditionService.updateHandPiles({
        // // // // //     clientId: ctx.client.id,
        // // // // //     draw,
        // // // // //     discard,
        // // // // // });
    }
}
