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
import { GameContext } from '../components/interfaces';
import { CardService } from '../components/card/card.service';

@Injectable()
export class DiscardCardAction {
    constructor(
        @InjectPinoLogger(DiscardCardAction.name)
        private readonly logger: PinoLogger,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        @Inject(forwardRef(() => CardService))
        private readonly cardService: CardService,
    ) {}

    emit({ctx, cardId}: {
        ctx: GameContext;
        cardId: CardId;
    }) {
        ctx.client.emit(
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

    async handle({
        client,
        cardId,
        ctx,
        emit = true,
    }: {
        readonly client: Socket;
        readonly cardId: CardId;
        ctx?: GameContext;
        emit?: boolean;
    }): Promise<void> {
        // First we get the game context
        if (!ctx) {
            ctx = await this.expeditionService.getGameContext(client);
        }

        // Now we set the logger context
        const logger = this.logger.logger.child(ctx.info);

        // now we get the hand and discard piles from the current game context
        let {
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
        hand = hand.filter((card) => {
            const field = getCardIdField(cardId);
            if (card[field] == cardId) cardToDiscard = card;
            
            return card[field] !== cardId;
        });

        logger.info(
            `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
        );

        if (emit) this.emit({ctx, cardId});
        // Next we check if the card has the key oldEnergy greater
        // than 0, if it is true them we set the card energy to the
        // oldEnergy value
        cardToDiscard.energy =
            cardToDiscard.oldEnergy > 0
                ? cardToDiscard.oldEnergy
                : cardToDiscard.energy;
        
        discard.push(cardToDiscard);
        
        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            hand,
            discard,
        });

    }
}
