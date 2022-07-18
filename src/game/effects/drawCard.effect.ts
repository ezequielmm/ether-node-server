import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { removeCardsFromPile } from 'src/utils';
import { CardTypeEnum } from '../components/card/card.enum';
import { EnemyIntentionType } from '../components/enemy/enemy.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { drawCardEffect } from './constants';
import { EffectDecorator } from './effects.decorator';
import { EffectDTO, EffectHandler } from './effects.interface';

export interface DrawCardArgs {
    useAttackingEnemies: true;
}

@EffectDecorator({
    effect: drawCardEffect,
})
@Injectable()
export class DrawCardEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(DrawCardEffect.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: EffectDTO<DrawCardArgs>): Promise<void> {
        const {
            client,
            args: { currentValue, useAttackingEnemies },
        } = payload;
        // TODO: Triger draw card attempted event

        if (useAttackingEnemies !== undefined && useAttackingEnemies) {
            await this.useAttackingEnemiesAsValue(client, currentValue);
        } else {
            await this.drawCard(client, currentValue);
        }
    }

    private async drawCard(client: Socket, cardsToTake: number): Promise<void> {
        // Get cards from current node
        const {
            data: {
                player: {
                    cards: { draw, hand, discard },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        // First we check if the draw pile more than the amount
        // of cards required

        if (draw.length >= cardsToTake) {
            const cardsToAdd = draw.slice(draw.length - cardsToTake);

            const newHand = [...hand, ...cardsToAdd];

            const newDraw = removeCardsFromPile({
                originalPile: draw,
                cardsToRemove: newHand,
            });

            await this.expeditionService.updateHandPiles({
                clientId: client.id,
                hand: newHand,
                draw: newDraw,
            });

            const cardMoves = cardsToAdd.map(({ id }) => {
                return {
                    source: 'draw',
                    destination: 'hand',
                    id,
                };
            });

            this.logger.log(
                `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
            );

            client.emit(
                'PutData',
                JSON.stringify(
                    StandardResponse.respond({
                        message_type: SWARMessageType.PlayerAffected,
                        action: SWARAction.MoveCard,
                        data: cardMoves,
                    }),
                ),
            );
        } else {
            // If not, we move all the discard pile to the draw pile
            // and draw the desired card to the hand pile

            let newDraw = [...discard, ...draw];

            const moveFromDiscardToDraw = discard.map(({ id }) => {
                return {
                    source: 'discard',
                    destination: 'draw',
                    id,
                };
            });

            this.logger.log(
                `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
            );

            client.emit(
                'PutData',
                JSON.stringify(
                    StandardResponse.respond({
                        message_type: SWARMessageType.PlayerAffected,
                        action: SWARAction.MoveCard,
                        data: moveFromDiscardToDraw,
                    }),
                ),
            );

            const newHand = newDraw
                .sort(() => 0.5 - Math.random())
                .slice(0, cardsToTake);

            newDraw = removeCardsFromPile({
                originalPile: draw,
                cardsToRemove: newHand,
            });

            const moveFromDrawToHand = newHand.map(({ id }) => {
                return {
                    source: 'draw',
                    destination: 'hand',
                    id,
                };
            });

            await this.expeditionService.updateHandPiles({
                clientId: client.id,
                draw: newDraw,
                hand: newHand,
                discard: [],
            });

            this.logger.log(
                `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
            );

            client.emit(
                'PutData',
                JSON.stringify(
                    StandardResponse.respond({
                        message_type: SWARMessageType.PlayerAffected,
                        action: SWARAction.MoveCard,
                        data: moveFromDrawToHand,
                    }),
                ),
            );
        }
    }

    private async useAttackingEnemiesAsValue(
        client: Socket,
        cardsToTake: number,
    ): Promise<void> {
        // Get cards and enemies from current node
        const {
            data: {
                player: {
                    cards: { draw, hand, discard },
                },
                enemies,
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        // Set initial enemies variable in 0
        let enemiesAttacking = 0;

        // Check if there are any enemies with
        // attacking intentions, if there are, increase the
        // enemiesAttacking variable by one
        enemies.forEach(({ currentScript: { intentions } }) => {
            intentions.forEach(({ type }) => {
                if (type === EnemyIntentionType.Attack) enemiesAttacking++;
            });
        });

        // if the enemies attacking are more than 0
        // we run re rest of the script
        if (enemiesAttacking > 0) {
            // First we calculate the real amount of cards to take
            // based on the amount to take * the enemies that are attacking
            const cardsNeeded = cardsToTake * enemiesAttacking;

            // Then, we get the defense cards that we have in the draw pile
            const drawDefenseCards = draw.filter(({ cardType }) => {
                return cardType === CardTypeEnum.Defend;
            });

            // we prepare the variables to store the cards and create the moves array
            // for the SWAR response
            let newHand = [...hand];
            let newDiscard = [...discard];
            let cardsToMove = [];

            // Now we check if we have at least one defense card
            if (drawDefenseCards.length > 0) {
                // If we do, we create a variable to check how many we can get
                // from the drawDefenseCards array
                const cardsToTakeFromDraw = Math.min(
                    drawDefenseCards.length,
                    cardsNeeded,
                );

                // Next, we get the defense cards that we have in the discard pile
                const discardDefenseCards = discard.filter(({ cardType }) => {
                    return cardType === CardTypeEnum.Defend;
                });

                // Now we calculate how many cards we need from the discard pile
                // if we dont have enough defense cards in the draw pile
                const cardsToTakeFromDiscard = Math.max(
                    Math.min(
                        cardsNeeded - cardsToTakeFromDraw,
                        discardDefenseCards.length,
                    ),
                    0,
                );

                // Now we take the cards from the draw pile
                const cardsFromDrawToHand = drawDefenseCards.slice(
                    0,
                    cardsToTakeFromDraw,
                );

                // Now we create the data for the SWAR to move the cards from the
                // draw pile to the hand pile
                cardsToMove = [
                    ...cardsFromDrawToHand.map(({ id }) => {
                        return {
                            source: 'draw',
                            destination: 'hand',
                            id,
                        };
                    }),
                ];

                // now we merge the new cards with the hand pile
                newHand = newHand.concat(cardsFromDrawToHand);

                // Then we have to take cards from the discard
                // if we have cards to take
                if (cardsToTakeFromDiscard > 0) {
                    // Now we take the cards from the discard pile
                    const cardFromDiscardToDraw = discardDefenseCards.slice(
                        0,
                        cardsToTakeFromDiscard,
                    );

                    // Now we create the data for the SWAR to move the cards from the
                    // discard pile to the hand pile
                    cardsToMove = [
                        ...cardsToMove,
                        ...cardFromDiscardToDraw.map(({ id }) => {
                            return {
                                source: 'discard',
                                destination: 'hand',
                                id,
                            };
                        }),
                    ];

                    // now we merge the new cards with the hand pile
                    newHand = newHand.concat(cardFromDiscardToDraw);

                    // Now we remove the cards from the discard pile
                    // that are being moved to the hand pile
                    newDiscard = removeCardsFromPile({
                        originalPile: discard,
                        cardsToRemove: cardFromDiscardToDraw,
                    });
                }

                // Now we remove the cards from the draw pile
                // that are being moved to the hand pile
                const newDraw = removeCardsFromPile({
                    originalPile: draw,
                    cardsToRemove: cardsFromDrawToHand,
                });

                await this.expeditionService.updateHandPiles({
                    clientId: client.id,
                    draw: newDraw,
                    hand: newHand,
                    discard: newDiscard,
                });

                this.logger.log(
                    `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
                );

                client.emit(
                    'PutData',
                    JSON.stringify(
                        StandardResponse.respond({
                            message_type: SWARMessageType.PlayerAffected,
                            action: SWARAction.CreateCard,
                            data: cardsToMove,
                        }),
                    ),
                );
            }
        }
    }
}
