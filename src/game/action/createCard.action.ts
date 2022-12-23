import { Injectable, Logger } from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { Card } from '../components/card/card.schema';
import { CardService } from '../components/card/card.service';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

interface CreateCardDTO {
    cardsToAdd: number[];
    client: Socket;
    destination: 'hand' | 'discard';
    sendSWARResponse: boolean;
}

@Injectable()
export class CreateCardAction {
    private readonly logger: Logger = new Logger(CreateCardAction.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
    ) {}

    async handle(dto: CreateCardDTO): Promise<void> {
        const { client, cardsToAdd, destination, sendSWARResponse } = dto;

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
        let newCards = (await this.cardService.findCardsById(
            cardsToAdd,
        )) as DocumentType<Card>[];

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

        // Here we check if we need to send a "PlayerAffected" message
        // to the frontend at the moment
        if (sendSWARResponse) {
            // Send message to the frontend to comunicate the new cards
            this.logger.debug(
                `Added ${newCards.length} new cards to player ${client.id} deck`,
            );

            client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageType.PlayerAffected,
                    action: SWARAction.MoveCard,
                    data: newCards.map(({ id }) => {
                        return {
                            source: null,
                            destination: 'hand',
                            id,
                        };
                    }),
                }),
            );
        }
    }
}
