import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { removeCardsFromPile } from 'src/utils';
import { CardTypeEnum } from '../components/card/card.enum';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';

interface DrawCardDTO {
    readonly client: Socket;
    readonly amountToTake: number;
    readonly cardType?: CardTypeEnum;
}

@Injectable()
export class DrawCardAction {
    private readonly logger: Logger = new Logger(DrawCardAction.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DrawCardDTO): Promise<void> {
        const { client, amountToTake, cardType } = payload;

        const cardTypeFilter = cardType === undefined ? 'All' : cardType;

        // First we check if we receive a cardType parameter
        // if not we set the filter to get all the cards

        // First we get the hand and draw piles from the current node object
        // Also we get the discard pile for a later step
        const {
            data: {
                player: {
                    cards: { hand, discard, draw },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        // First we check is we have to take at least 1 card
        if (amountToTake > 0) {
            // Now we check if we have a condition to filter the cards
            // by type

            let drawPile = draw;
            let discardPile = discard;

            if (cardTypeFilter !== 'All') {
                drawPile = draw.filter(({ cardType }) => {
                    return cardType === cardTypeFilter;
                });

                discardPile = discard.filter(({ cardType }) => {
                    return cardType === cardTypeFilter;
                });
            }

            // Verify how many card we need from the draw pile
            // And how many we might need from the discard pile
            const amountToTakeFromDraw = Math.min(
                amountToTake,
                drawPile.length,
            );
            const amountToTakeFromDiscard = Math.max(
                0,
                Math.min(amountToTake - drawPile.length, discardPile.length),
            );

            // Now, we will always take from the draw pile first
            // we will create the array that will store those cards first
            let cardsToMoveToHand: IExpeditionPlayerStateDeckCard[] = [];

            // Now we take the cards we need from the draw pile
            cardsToMoveToHand = drawPile.slice(0, amountToTakeFromDraw);

            // Remove the cards taken from the draw pile
            let newDraw = removeCardsFromPile({
                originalPile: draw,
                cardsToRemove: cardsToMoveToHand,
            });

            // Set the discard pile in case we don't need
            let newDiscard = [...discardPile];

            // Send create message for the new cards
            // source: draw
            // destination: hand
            this.logger.log(
                `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
            );

            client.emit(
                'PutData',
                JSON.stringify(
                    StandardResponse.respond({
                        message_type: SWARMessageType.PlayerAffected,
                        action: SWARAction.MoveCard,
                        data: cardsToMoveToHand.map(({ id }) => {
                            return {
                                source: 'draw',
                                destination: 'hand',
                                id,
                            };
                        }),
                    }),
                ),
            );

            // Now we check if we have to take cards from the discard pile
            if (amountToTakeFromDiscard > 0) {
                // First we move all the cards from the discard pile to the
                // draw pile and shuffle it
                newDraw = [...newDraw, ...discard].sort(
                    () => 0.5 - Math.random(),
                );

                // Send create message for the cards
                // source: discard
                // destination: draw
                this.logger.log(
                    `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
                );

                client.emit(
                    'PutData',
                    JSON.stringify(
                        StandardResponse.respond({
                            message_type: SWARMessageType.PlayerAffected,
                            action: SWARAction.MoveCard,
                            data: discardPile.map(({ id }) => {
                                return {
                                    source: 'discard',
                                    destination: 'draw',
                                    id,
                                };
                            }),
                        }),
                    ),
                );

                newDiscard = [];

                // Here we get the rest of cards to take from the discard pile
                const restOfCardsToTake = newDraw.slice(
                    0,
                    amountToTakeFromDiscard,
                );

                // next we take the rest of the card that we need
                cardsToMoveToHand = [
                    ...cardsToMoveToHand,
                    ...restOfCardsToTake,
                ];

                newDraw = removeCardsFromPile({
                    originalPile: newDraw,
                    cardsToRemove: cardsToMoveToHand,
                });

                // Send create message for the new cards
                // source: draw
                // destination: hand
                this.logger.log(
                    `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
                );

                client.emit(
                    'PutData',
                    JSON.stringify(
                        StandardResponse.respond({
                            message_type: SWARMessageType.PlayerAffected,
                            action: SWARAction.MoveCard,
                            data: restOfCardsToTake.map(({ id }) => {
                                return {
                                    source: 'draw',
                                    destination: 'hand',
                                    id,
                                };
                            }),
                        }),
                    ),
                );
            }

            // Move the cards to the hand pile
            const newHand = [...hand, ...cardsToMoveToHand];

            // Update piles
            await this.expeditionService.updateHandPiles({
                clientId: client.id,
                hand: newHand,
                draw: newDraw,
                discard: newDiscard,
            });
        }
    }
}
