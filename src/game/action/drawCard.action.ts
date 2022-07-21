import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';

interface DrawCardDTO {
    readonly client: Socket;
    readonly amountToTake: number;
}

@Injectable()
export class DrawCardAction {
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
            // First, we take the first cards required from the draw pile
            const cardsToMoveFromDrawToHand = draw.slice(0, amountToTake);

            // Next we remove 
        }
    }
}
