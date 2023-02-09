import { Injectable, Logger } from '@nestjs/common';
import { filter, includes, reject } from 'lodash';
import { CardKeywordEnum } from '../components/card/card.enum';
import { GameContext } from '../components/interfaces';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

@Injectable()
export class DiscardAllCardsAction {
    private readonly logger: Logger = new Logger(DiscardAllCardsAction.name);

    async handle(ctx: GameContext, messageType: SWARMessageType) {
        // Get cards from playerk
        const cards = ctx.expedition.currentNode.data.player.cards;

        // Determine which cards to discard and which to exhaust
        const isFade = (card) => includes(card.keywords, CardKeywordEnum.Fade);

        const cardsToExhaust = filter(cards.hand, isFade);
        const cardsToDiscard = reject(cards.hand, isFade);

        cards.hand = [];
        cards.discard.push(...cardsToDiscard);
        cards.exhausted.push(...cardsToExhaust);

        // Save expedition
        ctx.expedition.markModified('currentNode.data.player.cards');
        await ctx.expedition.save();

        // Create data to send to client for each card moved
        const data = [];

        for (const card of [...cardsToExhaust, ...cardsToDiscard]) {
            data.push({
                source: 'hand',
                destination: isFade(card) ? 'exhaust' : 'discard',
                id: card.id,
            });
        }

        ctx.client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: messageType,
                action: SWARAction.MoveCard,
                data: data,
            }),
        );

        this.logger.log(`Discarded and exhausted all cards`);
    }
}
