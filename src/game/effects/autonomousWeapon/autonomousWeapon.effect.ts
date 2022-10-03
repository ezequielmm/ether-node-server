import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { HistoryService } from 'src/game/history/history.service';
import { CardRegistry } from 'src/game/history/interfaces';
import { removeCardsFromPile } from 'src/utils';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { autonomousWeaponEffect } from './constants';

@EffectDecorator({
    effect: autonomousWeaponEffect,
})
@Injectable()
export class AutonomousWeaponEffect implements EffectHandler {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly historyService: HistoryService,
    ) {}

    async handle(dto: EffectDTO): Promise<void> {
        const { ctx } = dto;

        // Get the card that was played by history service and move it
        // to the draw pile
        const card = this.historyService.findLast<CardRegistry>(ctx.client.id, {
            type: 'card',
            card: {},
        });

        if (!card)
            throw new Error('Card Autonomous Weapon not found in history');

        const { discard, draw } = ctx.expedition.currentNode.data.player.cards;

        // Add the card to the draw pile
        draw.push(card.card);
        // Remove the card from the discard pile
        ctx.expedition.currentNode.data.player.cards.discard =
            removeCardsFromPile({
                originalPile: discard,
                cardsToRemove: [card.card],
            });

        // Update the expedition
        await this.expeditionService.updateHandPiles({
            clientId: ctx.client.id,
            draw,
            discard,
        });
    }
}
