import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { removeCardsFromPile } from 'src/utils';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { drawCardEffect } from './constants';
import { EffectDecorator } from './effects.decorator';
import { EffectDTO, IBaseEffect } from './effects.interface';

@EffectDecorator({
    effect: drawCardEffect,
})
@Injectable()
export class DrawCardEffect implements IBaseEffect {
    private readonly logger: Logger = new Logger(DrawCardEffect.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: EffectDTO): Promise<void> {
        const {
            client,
            args: { currentValue },
        } = payload;
        // TODO: Triger draw card attempted event

        this.drawCard(client, currentValue);
    }

    private async drawCard(client: Socket, cardsTotake: number): Promise<void> {
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

        if (draw.length >= cardsTotake) {
            const cardsToAdd = draw.slice(draw.length - cardsTotake);

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

            const cardMoves = cardsToAdd.map((card) => {
                return {
                    source: 'draw',
                    destination: 'hand',
                    id: card.id,
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
                        message_type: SWARMessageType.PlayerAffected,
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
                    cardId: card.id,
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
}
