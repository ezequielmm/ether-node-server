import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardService } from '../components/card/card.service';
import { ExpeditionService } from '../components/expedition/expedition.service';

interface CreateCardDTO {
    cardsToAdd: number[];
    client: Socket;
    destination: 'hand' | 'discard';
}

@Injectable()
export class CreateCardAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
    ) {}

    async handle(dto: CreateCardDTO): Promise<void> {
        const { client, cardsToAdd, destination } = dto;

        // Get the current decks for the player
        const {
            data: {
                player: { cards },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        const destinationDeck = cards[destination];

        // Query the cards we need from the card service
        let newCards = await this.cardService.findCardsById(cardsToAdd);

        // Generate UUIDs for the new cards
        newCards = newCards.map((card) => {
            card.id = randomUUID();
            card.description = CardDescriptionFormatter.process(card);
            return card;
        });

        // Add the cards to the destination pile
        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            [destination]: [...newCards, ...destinationDeck],
        });

        // Send message to the frontend to 
    }
}
