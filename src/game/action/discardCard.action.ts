import { Injectable } from '@nestjs/common';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { CardId } from '../components/card/card.type';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ClientId } from '../components/expedition/expedition.type';

interface DiscardCardDTO {
    readonly clientId: ClientId;
    readonly cardId: CardId;
}

@Injectable()
export class DiscardCardAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DiscardCardDTO) {
        const { clientId, cardId } = payload;

        // First we get the hand and discard piles from the current node object
        const {
            data: {
                player: {
                    cards: { hand, discard },
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

        // Before we move it to the discard pile, we check if the
        // card has to double its effect values
        // First we loop the card effects
        cardToDiscard.properties.effects.map((effect) => {
            // If is true, we double the values for the card
            // before moving it to the discard pile
            if (
                effect.args.doubleValuesWhenPlayed !== undefined &&
                effect.args.doubleValuesWhenPlayed
            ) {
                effect.args.value *= 2;
                if (effect.args.times !== undefined) effect.args.times *= 2;
            }

            // Also we check if the card has to lower its values every time is used
            if (
                effect.args.decreaseValue !== undefined &&
                effect.args.decreaseValue
            ) {
                effect.args.value -= effect.args.decrementBy;
            }

            return effect;
        });

        // Them add the card to the discard pile
        discard.push(cardToDiscard);

        await this.expeditionService.updateHandPiles({
            clientId,
            hand: newHand,
            discard,
        });
    }
}
