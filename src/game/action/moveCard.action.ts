import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { isNotUndefined, removeCardsFromPile } from 'src/utils';
import { CardSelectionScreenOriginPileEnum } from '../components/cardSelectionScreen/cardSelectionScreen.enum';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

interface IMoveCardDTO {
    readonly client: Socket;
    readonly cardIds: string[];
    readonly originPile: CardSelectionScreenOriginPileEnum;
    readonly callback?: (
        card: IExpeditionPlayerStateDeckCard,
    ) => IExpeditionPlayerStateDeckCard;
}

@Injectable()
export class MoveCardToHandAction {
    private readonly logger: Logger = new Logger(MoveCardToHandAction.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: IMoveCardDTO): Promise<void> {
        // First we deestructure the payload and get the data
        const { cardIds, originPile, client, callback } = payload;

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
            .filter(({ id }) => {
                return cardIds.includes(id);
            })
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
                data: cardsToMove.map(({ id, ...data }) => ({
                    source: originPile,
                    destination: 'hand',
                    id,
                    card: data
                })),
            }),
        );

        // Now we actually update the piles on the database
        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            [originPile]: deckPile,
            hand: [...cards.hand, ...cardsToMove],
        });
    }
}
