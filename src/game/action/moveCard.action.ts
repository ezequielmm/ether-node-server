import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { removeCardsFromPile } from 'src/utils';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { Expedition } from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

interface IMoveCardDTO {
    readonly client: Socket;
    readonly cardIds: string[];
    readonly originPile: keyof Expedition['currentNode']['data']['player']['cards'];
    readonly targetPile?: keyof Expedition['currentNode']['data']['player']['cards'];
    readonly callback?: (
        card: IExpeditionPlayerStateDeckCard,
    ) => IExpeditionPlayerStateDeckCard;
}

@Injectable()
export class MoveCardAction {
    private readonly logger: Logger = new Logger(MoveCardAction.name);

    constructor(
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
    ) {}

    async handle(payload: IMoveCardDTO): Promise<void> {
        // First we deestructure the payload and get the data
        const {
            cardIds,
            originPile,
            targetPile = 'hand',
            client,
            callback,
        } = payload;

        // Now we get the current node information
        const {
            data: {
                player: { cards },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        // Now we set a variable for the cardfrom where we
        // are going to take the cards
        let deckPile = cards[originPile];

        // Now we take the cards by its id and check if we have to
        // change their cost down to 0
        const cardsToMove = deckPile
            .filter(({ id }) => cardIds.includes(id))
            .map(callback || ((card) => card));

        // Now we remove the cards from the desired pile
        // to update the piles
        deckPile = removeCardsFromPile({
            originalPile: deckPile,
            cardsToRemove: cardsToMove,
        });

        // Send create message for the new cards
        // source: the desired pile
        // destination: hand
        this.logger.debug(
            `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
        );

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerAffected,
                action: SWARAction.MoveCard,
                data: cardsToMove.map((card) => ({
                    source: originPile,
                    destination: targetPile,
                    id: card.id,
                    card,
                })),
            }),
        );

        // Now we actually update the piles on the database
        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            [originPile]: deckPile,
            [targetPile]: [...cards[targetPile], ...cardsToMove],
        });
    }
}
