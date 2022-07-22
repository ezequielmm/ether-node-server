import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { removeCardsFromPile } from 'src/utils';
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
}

interface ICardMoves {
    source: string;
    destination: string;
    id: string;
}

@Injectable()
export class DrawCardAction {
    private readonly logger: Logger = new Logger(DrawCardAction.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DrawCardDTO): Promise<void> {
        const { client, amountToTake } = payload;

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

        // We verify that we have enough cards in the draw
        // pile to move them to the hand pile
        if (amountToTake <= draw.length) {
            const data = await this.drawCardsFromDrawPile(
                client.id,
                draw,
                hand,
                amountToTake,
            );

            // Finally we send the message to the frontend to create the animations
            this.logger.log(
                `Sent message PutData to client ${client.id}: ${SWARAction.CreateCard}`,
            );

            client.emit(
                'PutData',
                JSON.stringify(
                    StandardResponse.respond({
                        message_type: SWARMessageType.PlayerAffected,
                        action: SWARAction.CreateCard,
                        data,
                    }),
                ),
            );
        } else {
            // If the amount of cards that we require is higher than
            // the amount of cards that we have available on the draw pile
            // we calculate and take all the cards from the draw pile,
            // move all the discard pile to the draw pile, shuffle it, and take
            // the remaining cards again from the draw pile
        }
    }

    private async drawCardsFromDrawPile(
        clientId: string,
        draw: IExpeditionPlayerStateDeckCard[],
        hand: IExpeditionPlayerStateDeckCard[],
        amountToTake: number,
    ): Promise<ICardMoves[]> {
        // First, we take the first cards required from the draw pile
        const cardsToDraw = draw.slice(0, amountToTake);

        // Next we remove those cards from the draw pile
        const newDraw = removeCardsFromPile({
            originalPile: draw,
            cardsToRemove: cardsToDraw,
        });

        const newHand = [...hand, ...cardsToDraw];

        await this.expeditionService.updateHandPiles({
            clientId,
            draw: newDraw,
            hand: newHand,
        });

        // Now we generate the create card message for the frontend
        return cardsToDraw.map(({ id }) => {
            return {
                source: 'draw',
                destination: 'hand',
                id,
            };
        });
    }
}
