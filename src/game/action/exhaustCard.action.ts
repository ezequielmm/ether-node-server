import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Socket } from 'socket.io';
import { CardId } from '../components/card/card.type';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { GameContext } from '../components/interfaces';

@Injectable()
export class ExhaustCardAction {
    constructor(
        @InjectPinoLogger(ExhaustCardAction.name)
        private readonly logger: PinoLogger,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
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
                        destination: 'exhaust',
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

        // Now we get the hand and discard piles from the current node object
        let {
            expedition: {
                currentNode: {
                    data: {
                        player: {
                            cards: { hand, exhausted },
                        },
                    },
                },
            },
        } = ctx;

        // Then we take the desired card from the hand pile
        // Also remove it from the hand pile
        let cardToDiscard: IExpeditionPlayerStateDeckCard = null;

        hand = hand.filter((card) => {
            const field = typeof cardId === 'string' ? 'id' : 'cardId';

            if (card[field] === cardId) cardToDiscard = card;

            return card[field] !== cardId;
        });

        // Them add the card to the exhausted pile
        exhausted.push(cardToDiscard);

        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            hand,
            exhausted,
        });

        logger.info(
            `Sent message PutData to client ${client.id}: ${SWARAction.MoveCard}`,
        );

        if (emit) this.emit({ctx, cardId});
    }
}
