import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { isNotUndefined } from 'src/utils';
import { CardId, getCardIdField } from '../components/card/card.type';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

interface DiscardCardDTO {
    readonly client: Socket;
    readonly cardId: CardId;
}

@Injectable()
export class DiscardCardAction {
    private readonly logger: Logger = new Logger(DiscardCardAction.name);

    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(payload: DiscardCardDTO): Promise<void> {
        const { client, cardId } = payload;

        // First we get the hand and discard piles from the current node object
        const {
            data: {
                player: {
                    cards: { hand, discard },
                },
            },
        } = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        // Then we take the desired card from the hand pile
        // Also remove it from the hand pile
        let cardToDiscard: IExpeditionPlayerStateDeckCard = null;

        const newHand = hand.filter((card) => {
            const field = getCardIdField(cardId);

            if (card[field] === cardId) cardToDiscard = card;

            return card[field] !== cardId;
        });

        // Before we move it to the discard pile, we check if the
        // card has to double its effect values
        // First we loop the card effects
        cardToDiscard.properties.effects.map((effect) => {
            // If is true, we double the values for the card
            // before moving it to the discard pile
            if (isNotUndefined(effect.args.doubleValuesWhenPlayed)) {
                effect.args.value *= 2;
                if (effect.args.times !== undefined) effect.args.times *= 2;
            }

            // Also we check if the card has to lower its values every time is used
            if (isNotUndefined(effect.args.decreaseValue)) {
                // We lower the value (won't be reduce below 1)
                const newValue = Math.max(
                    1,
                    effect.args.value - effect.args.decrementBy,
                );
                effect.args.value = newValue;
            }

            return effect;
        });

        // Them add the card to the discard pile
        discard.push(cardToDiscard);

        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            hand: newHand,
            discard,
        });

        this.logger.debug(
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
                        destination: 'discard',
                        id: cardId,
                    },
                ],
            }),
        );
    }
}
