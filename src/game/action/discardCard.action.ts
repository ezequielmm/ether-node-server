import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
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

@Injectable()
export class DiscardCardAction {
    constructor(
        @InjectPinoLogger(DiscardCardAction.name)
        private readonly logger: PinoLogger,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
    ) {}

    async handle({
        client,
        cardId,
    }: {
        readonly client: Socket;
        readonly cardId: CardId;
    }): Promise<void> {
        // First we get the game context
        const ctx = await this.expeditionService.getGameContext(client);

        // Now we set the logger context
        const logger = this.logger.logger.child(ctx.info);

        // now we get the hand and discard piles from the current game context
        const {
            expedition: {
                currentNode: {
                    data: {
                        player: {
                            cards: { hand, discard },
                        },
                    },
                },
            },
        } = ctx;

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
                if (effect.times !== undefined) effect.times *= 2;
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

        // Next we check if the card has the key oldEnergy greater
        // than 0, if it is true them we set the card energy to the
        // oldEnergy value
        cardToDiscard.energy =
            cardToDiscard.oldEnergy > 0
                ? cardToDiscard.oldEnergy
                : cardToDiscard.energy;

        // Them add the card to the discard pile
        discard.push(cardToDiscard);

        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            hand: newHand,
            discard,
        });

        logger.info(
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
