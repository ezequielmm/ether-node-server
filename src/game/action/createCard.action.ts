import { Injectable } from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose';
import { randomUUID } from 'crypto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
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

@Injectable()
export class CreateCardAction {
    constructor(
        @InjectPinoLogger(CreateCardAction.name)
        private readonly logger: PinoLogger,
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
    ) {}

    async handle({
        client,
        cardsToAdd,
        destination,
        sendSWARResponse,
    }: {
        cardsToAdd: number[];
        client: Socket;
        destination: 'hand' | 'discard';
        sendSWARResponse: boolean;
    }): Promise<void> {
        // First get game context
        const ctx = await this.expeditionService.getGameContext(client);

        const logger = this.logger.logger.child(ctx.info);

        // Get the current decks for the player
        const {
            expedition: {
                currentNode: {
                    data: {
                        player: { cards },
                    },
                },
            },
        } = ctx;

        const destinationDeck = cards[destination];

        // Query the cards we need from the card service
        let newCards = (await this.cardService.findCardsById(
            cardsToAdd,
        )) as DocumentType<Card>[];

        // Generate UUIDs for the new cards
        newCards = newCards.map((card) => {
            card.id = randomUUID();
            card.description = CardDescriptionFormatter.process(card);
            this.cardService.addStatusDescriptions(card);

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
            logger.info(
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
                            destination,
                            id,
                        };
                    }),
                }),
            );
        }
    }
}
