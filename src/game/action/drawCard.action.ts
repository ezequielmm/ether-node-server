import { Injectable } from '@nestjs/common';
import { isNotUndefined, removeCardsFromPile } from 'src/utils';
import { CardTypeEnum } from '../components/card/card.enum';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { confusion } from '../status/confusion/constants';
import { CardService } from '../components/card/card.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_AFTER_DRAW_CARDS } from '../constants';
import { GameContext } from '../components/interfaces';
import { shuffle, takeRight } from 'lodash';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export interface AfterDrawCardEvent {
    ctx: GameContext;
    newHand: IExpeditionPlayerStateDeckCard[];
    newDiscard: IExpeditionPlayerStateDeckCard[];
    newDraw: IExpeditionPlayerStateDeckCard[];
}

@Injectable()
export class DrawCardAction {
    constructor(
        @InjectPinoLogger(DrawCardAction.name)
        private readonly logger: PinoLogger,
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly eventEmitter2: EventEmitter2,
    ) {}

    async handle({
        ctx,
        amountToTake,
        cardType,
        SWARMessageTypeToSend,
        useEnemiesConfusedAsValue,
    }: {
        readonly ctx: GameContext;
        readonly amountToTake: number;
        readonly SWARMessageTypeToSend: SWARMessageType;
        readonly cardType?: CardTypeEnum;
        readonly useEnemiesConfusedAsValue?: boolean;
    }): Promise<void> {
        const { client } = ctx;

        const logger = this.logger.logger.child(ctx.info);

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
                enemies,
            },
        } = ctx.expedition.currentNode;

        // First we check is we have to take at least 1 card
        if (amountToTake > 0) {
            // Now we check if we have a condition to filter the cards
            // by type

            let drawPile = draw;
            let discardPile = discard;

            if (cardTypeFilter !== 'All') {
                drawPile = draw.filter(
                    ({ cardType }) => cardType === cardTypeFilter,
                );

                discardPile = discard.filter(
                    ({ cardType }) => cardType === cardTypeFilter,
                );
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
            cardsToMoveToHand = takeRight(drawPile, amountToTakeFromDraw);

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
            logger.info(
                `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
            );

            client.emit(
                'PutData',
                StandardResponse.respond({
                    message_type: SWARMessageTypeToSend,
                    action: SWARAction.MoveCard,
                    data: cardsToMoveToHand.map(({ id }) => ({
                        source: 'draw',
                        destination: 'hand',
                        id,
                    })),
                }),
            );

            // Now we check if we have to take cards from the discard pile
            if (amountToTakeFromDiscard > 0) {
                // First we move all the cards from the discard pile to the
                // draw pile and shuffle it
                newDraw = shuffle([...newDraw, ...discard]);

                // Send create message for the cards
                // source: discard
                // destination: draw
                logger.info(
                    `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
                );

                client.emit(
                    'PutData',
                    StandardResponse.respond({
                        message_type: SWARMessageTypeToSend,
                        action: SWARAction.MoveCard,
                        data: discardPile.map(({ id }) => ({
                            source: 'discard',
                            destination: 'draw',
                            id,
                        })),
                    }),
                );

                newDiscard = [];

                // Here we get the rest of cards to take from the discard pile
                const restOfCardsToTake = takeRight(
                    newDraw,
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
                logger.info(
                    `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
                );

                client.emit(
                    'PutData',
                    StandardResponse.respond({
                        message_type: SWARMessageTypeToSend,
                        action: SWARAction.MoveCard,
                        data: restOfCardsToTake.map(({ id }) => ({
                            source: 'draw',
                            destination: 'hand',
                            id,
                        })),
                    }),
                );
            }

            // Here we check if we have to modify the energy cost
            // of the taken cards if there is at least one
            // enemy with a confusion status
            if (isNotUndefined(useEnemiesConfusedAsValue)) {
                // First we initialize a boolean for the confused
                // enemies

                // Next go to all the enemies and check if we have
                // at least one enemy confused
                const hasConfusedEnemies = enemies.some(
                    ({ statuses: { debuff } }) =>
                        debuff.some((item) => item.name === confusion.name),
                );

                // If it does, we modify the cost for the cards to 0
                if (hasConfusedEnemies)
                    cardsToMoveToHand.forEach((card) => {
                        card.energy = 0;
                    });
            }

            // Move the cards to the hand pile
            const newHand = [...hand, ...cardsToMoveToHand];

            // Reset the energy of the cards in the hand
            for (const card of newHand) {
                const { energy } = await this.cardService.findById(card.cardId);
                card.energy = energy;
            }

            // Update piles
            await this.expeditionService.updateHandPiles({
                clientId: client.id,
                hand: newHand,
                draw: newDraw,
                discard: newDiscard,
            });

            const afterDrawCardsEvent: AfterDrawCardEvent = {
                ctx,
                newHand,
                newDraw,
                newDiscard,
            };

            await this.eventEmitter2.emitAsync(
                EVENT_AFTER_DRAW_CARDS,
                afterDrawCardsEvent,
            );
        }
    }
}
