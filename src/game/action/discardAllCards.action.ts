import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

interface DiscardAllCardsDTO {
    readonly client: Socket;
}

@Injectable()
export class DiscardAllCardsAction {
    private readonly logger: Logger = new Logger(DiscardAllCardsAction.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DiscardAllCardsDTO) {
        const { client } = payload;

        const {
            data: {
                player: {
                    cards: { hand, discard },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        const newDiscard = [...hand, ...discard];

        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            hand: [],
            discard: newDiscard,
        });

        const cardMoves = hand.map(({ id }) => {
            return {
                source: 'npm run starthand',
                destination: 'discard',
                cardId: id,
            };
        });

        this.logger.log(
            `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
        );

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.EndTurn,
                    action: SWARAction.MoveCard,
                    data: cardMoves,
                }),
            ),
        );
    }
}
