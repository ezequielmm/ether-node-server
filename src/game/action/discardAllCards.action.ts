import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { removeCardsFromPile } from 'src/utils';
import { CardKeywordEnum } from '../components/card/card.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

interface DiscardAllCardsDTO {
    readonly client: Socket;
    readonly SWARMessageTypeToSend: SWARMessageType;
}

@Injectable()
export class DiscardAllCardsAction {
    private readonly logger: Logger = new Logger(DiscardAllCardsAction.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DiscardAllCardsDTO) {
        const { client, SWARMessageTypeToSend } = payload;

        const {
            data: {
                player: {
                    cards: { hand, discard, exhausted },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        const cardsToExhaust = hand.filter((card) =>
            card.keywords.includes(CardKeywordEnum.Fade),
        );

        const newHand = removeCardsFromPile({
            originalPile: hand,
            cardsToRemove: cardsToExhaust,
        });

        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            hand: [],
            discard: [...newHand, ...discard],
            exhausted: [...exhausted, ...cardsToExhaust],
        });

        const cardMoves = hand.map(({ id, keywords }) => {
            return {
                source: 'hand',
                destination: keywords.includes(CardKeywordEnum.Fade)
                    ? 'exhaust'
                    : 'discard',
                id,
            };
        });

        this.logger.debug(
            `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
        );

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageTypeToSend,
                action: SWARAction.MoveCard,
                data: cardMoves,
            }),
        );
    }
}
