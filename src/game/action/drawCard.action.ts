import { Injectable } from '@nestjs/common';
import { isNotUndefined, removeCardsFromPile } from 'src/utils';
import {
    CardTypeEnum,
    CardDrawDepletedStrategyEnum,
} from '../components/card/card.enum';
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
import { shuffle, takeRight, sampleSize } from 'lodash';
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
        filterType,
        SWARMessageTypeToSend,
        useEnemiesConfusedAsValue,
    }: {
        ctx: GameContext;
        readonly amountToTake: number;
        readonly SWARMessageTypeToSend: SWARMessageType;
        readonly filterType?: CardTypeEnum;
        readonly useEnemiesConfusedAsValue?: boolean;
    }): Promise<void> {
        if (amountToTake < 1) return;

        const { client } = ctx;
        const logger = this.logger.logger.child(ctx.info);

        const filterPile = function (
            pile: IExpeditionPlayerStateDeckCard[],
        ): IExpeditionPlayerStateDeckCard[] {
            return typeof filterType === 'undefined'
                ? pile
                : pile.filter(({ cardType }) => cardType === filterType);
        };

        const {
            data: {
                player: {
                    cards: { hand, discard, draw },
                },
                enemies,
            },
        } = ctx.expedition.currentNode;

        const drawFiltered = filterPile(draw);
        const discardFiltered = filterPile(discard);

        // First, draw from draw pile
        let cardsTaken: IExpeditionPlayerStateDeckCard[] = takeRight(
            drawFiltered,
            Math.min(amountToTake, drawFiltered.length),
        );

        // Remove Drawn Cards from full current draw pile
        let newDraw = removeCardsFromPile({
            originalPile: draw,
            cardsToRemove: cardsTaken,
        });

        // Tell client to draw the cards available in the draw pile.
        logger.info(
            `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
        );

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageTypeToSend,
                action: SWARAction.MoveCard,
                data: cardsTaken.map(({ id }) => ({
                    source: 'draw',
                    destination: 'hand',
                    id,
                })),
            }),
        );

        // Do we still need more cards?
        let newDiscard = [...discard];

        if (cardsTaken.length < amountToTake && discardFiltered.length > 0) {
            const drawDepletedStrategy =
                typeof filterType === 'undefined'
                    ? CardDrawDepletedStrategyEnum.ShuffleDiscard
                    : CardDrawDepletedStrategyEnum.SampleDiscard;
            let remainingCardsTaken: IExpeditionPlayerStateDeckCard[] = [];

            if (
                drawDepletedStrategy ===
                CardDrawDepletedStrategyEnum.SampleDiscard
            ) {
                // sampleSize grabs unique random elements up to value as collection
                remainingCardsTaken = sampleSize(
                    discardFiltered,
                    amountToTake - cardsTaken.length,
                );

                // Tell client to move cards from discard to hand.
                logger.info(
                    `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
                );

                client.emit(
                    'PutData',
                    StandardResponse.respond({
                        message_type: SWARMessageTypeToSend,
                        action: SWARAction.MoveCard,
                        data: remainingCardsTaken.map(({ id }) => ({
                            source: 'discard',
                            destination: 'hand',
                            id,
                        })),
                    }),
                );

                newDiscard = removeCardsFromPile({
                    originalPile: discard,
                    cardsToRemove: remainingCardsTaken,
                });
            }

            if (
                drawDepletedStrategy ===
                CardDrawDepletedStrategyEnum.ShuffleDiscard
            ) {
                // First, shuffle the discard pile and place it on the bottom of the draw pile.
                // Typically, newDraw will be empty here, but if filtering, perhaps not
                newDraw = [...newDraw, ...shuffle(discard)];
                newDiscard = [];

                logger.info(
                    `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
                );

                client.emit(
                    'PutData',
                    StandardResponse.respond({
                        message_type: SWARMessageTypeToSend,
                        action: SWARAction.MoveCard,
                        data: discard.map(({ id }) => ({
                            source: 'discard',
                            destination: 'draw',
                            id,
                        })),
                    }),
                );

                // Now, take the remaining cards from the new draw pile, respecting filtered type
                remainingCardsTaken = takeRight(
                    filterPile(newDraw),
                    amountToTake - cardsTaken.length,
                );

                newDraw = removeCardsFromPile({
                    originalPile: newDraw,
                    cardsToRemove: remainingCardsTaken,
                });

                logger.info(
                    `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
                );

                client.emit(
                    'PutData',
                    StandardResponse.respond({
                        message_type: SWARMessageTypeToSend,
                        action: SWARAction.MoveCard,
                        data: remainingCardsTaken.map(({ id }) => ({
                            source: 'draw',
                            destination: 'hand',
                            id,
                        })),
                    }),
                );
            }

            // Consolidate all cards taken to one list
            cardsTaken = [...cardsTaken, ...remainingCardsTaken];
        }

        // This modificationNow modify cards taken if necessary
        if (isNotUndefined(useEnemiesConfusedAsValue)) {
            // is there a confused enemy?
            const hasConfusedEnemies = enemies.some(
                ({ statuses: { debuff: debuffs } }) =>
                    debuffs.some((debuff) => debuff.name === confusion.name),
            );

            // If so, cards cost 0
            if (hasConfusedEnemies)
                cardsTaken.forEach((card) => {
                    card.energy = 0;
                });
        }

        // Move the cards taken to the hand pile
        const newHand = [...hand, ...cardsTaken];
    

        // FIX ME: This shouldn't be here. It cancels out the discounts on draw, and cards should be resetting as they are discarded, if they are meant to
        /*
        // Reset the energy of the cards in the hand
        for (const card of newHand) {
            const { energy } = await this.cardService.findById(card.cardId);
            card.energy = energy;
        }
        */

        // Update piles
        const expUpdated = await this.expeditionService.updateHandPiles({
            clientId: client.id,
            hand: newHand,
            draw: newDraw,
            discard: newDiscard,
        });
        
        const newCardsObject = expUpdated.currentNode.data.player.cards;
        ctx.expedition.currentNode.data.player.cards = newCardsObject;

        await this.eventEmitter2.emitAsync(EVENT_AFTER_DRAW_CARDS, {
            ctx,
            newHand,
            newDraw,
            newDiscard,
        });
    }
}
