import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { removeCardsFromPile } from 'src/utils';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';

interface DrawCardDTO {
    client: Socket;
    cardsTotake: number;
}

@Injectable()
export class DrawCardProcess {
    private readonly logger: Logger = new Logger(DrawCardProcess.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DrawCardDTO): Promise<void> {
        const { client, cardsTotake } = payload;

        const {
            data: {
                player: {
                    cards: { discard, draw },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        // Then, we verify if the draw pile has enough cards to shuffle and take from it
        // If not, we move all the discard cards to the draw pile and shuffle
        if (draw.length >= cardsTotake) {
            const newHand = draw
                .sort(() => 0.5 - Math.random())
                .slice(0, cardsTotake);

            const newDraw = removeCardsFromPile({
                originalPile: draw,
                cardsToRemove: newHand,
            });

            const cardsToMove = newHand.map((card) => {
                return {
                    source: 'draw',
                    destination: 'hand',
                    id: card.id,
                };
            });

            await this.expeditionService.updateHandPiles({
                clientId: client.id,
                draw: newDraw,
                hand: newHand,
            });

            this.logger.log(
                `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
            );

            client.emit(
                'PutData',
                JSON.stringify(
                    StandardResponse.respond({
                        message_type: SWARMessageType.BeginTurn,
                        action: SWARAction.MoveCard,
                        data: cardsToMove,
                    }),
                ),
            );
        } else {
            let newDraw = [...discard, ...draw];

            const moveFromDiscardToDraw = discard.map((card) => {
                return {
                    source: 'discard',
                    destination: 'draw',
                    cardId: card.id,
                };
            });

            this.logger.log(
                `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
            );

            client.emit(
                'PutData',
                JSON.stringify(
                    StandardResponse.respond({
                        message_type: SWARMessageType.BeginTurn,
                        action: SWARAction.MoveCard,
                        data: moveFromDiscardToDraw,
                    }),
                ),
            );

            const newHand = newDraw
                .sort(() => 0.5 - Math.random())
                .slice(0, cardsTotake);

            newDraw = removeCardsFromPile({
                originalPile: draw,
                cardsToRemove: newHand,
            });

            const moveFromDrawToHand = newHand.map((card) => {
                return {
                    source: 'draw',
                    destination: 'hand',
                    id: card.id,
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
                        message_type: SWARMessageType.BeginTurn,
                        action: SWARAction.CreateCard,
                        data: moveFromDrawToHand,
                    }),
                ),
            );
        }
    }
}
