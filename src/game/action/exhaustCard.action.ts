import { Injectable } from '@nestjs/common';
import { CardId } from '../components/card/card.type';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { ClientId } from '../components/expedition/expedition.type';

interface ExhaustCardDTO {
    readonly clientId: ClientId;
    readonly cardId: CardId;
}

@Injectable()
export class ExhaustCardAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: ExhaustCardDTO) {
        const { clientId, cardId } = payload;

        // First we get the hand and discard piles from the current node object
        const {
            data: {
                player: {
                    cards: { hand, exhausted },
                },
            },
        } = await this.expeditionService.getCurrentNode({ clientId });

        // Then we take the desired card from the hand pile
        // Also remove it from the hand pile
        let cardToDiscard: IExpeditionPlayerStateDeckCard = null;

        const newHand = hand.filter((card) => {
            const field = typeof cardId === 'string' ? 'id' : 'cardId';

            if (card[field] === cardId) cardToDiscard = card;

            return card[field] !== cardId;
        });

        // Them add the card to the exhausted pile
        exhausted.push(cardToDiscard);

        await this.expeditionService.updateHandPiles({
            clientId,
            hand: newHand,
            exhausted,
        });
    }
}
