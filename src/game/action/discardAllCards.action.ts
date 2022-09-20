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
                source: 'hand',
                destination: 'discard',
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
