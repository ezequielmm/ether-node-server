import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CardId } from '../components/card/card.type';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';

interface ExhaustCardDTO {
    readonly client: Socket;
    readonly cardId: CardId;
}

@Injectable()
export class ExhaustCardAction {
    private readonly logger: Logger = new Logger(ExhaustCardAction.name);

    constructor(
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
    ) {}

    async handle(payload: ExhaustCardDTO): Promise<void> {
        const { client, cardId } = payload;

        // First we get the hand and discard piles from the current node object
        const {
            data: {
                player: {
                    cards: { hand, exhausted },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        // Then we take the desired card from the hand pile
        // Also remove it from the hand pile
        let cardToDiscard: IExpeditionPlayerStateDeckCard = null;

        const newHand = hand.filter((card) => {
            const field = typeof cardId === 'string' ? 'id' : 'cardId';

            if (card[field] === cardId) cardToDiscard = card;

            return card[field] !== cardId;
        });

        // Them add the card to the exhausted pile
        exhausted.push(cardToDiscard);

        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            hand: newHand,
            exhausted,
        });

        this.logger.log(
            `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
        );

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerAffected,
                action: SWARAction.MoveCard,
                data: [
                    {
                        source: 'hand',
                        destination: 'exhaust',
                        id: cardId,
                    },
                ],
            }),
        );
    }
}
