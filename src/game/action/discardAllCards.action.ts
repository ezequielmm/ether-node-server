import { Injectable } from '@nestjs/common';
import { filter, includes, reject } from 'lodash';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CardKeywordEnum } from '../components/card/card.enum';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { GameContext } from '../components/interfaces';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

@Injectable()
export class DiscardAllCardsAction {
    constructor(
        @InjectPinoLogger()
        private readonly logger: PinoLogger,
    ) {}

    async handle(ctx: GameContext, messageType: SWARMessageType) {
        const { client } = ctx;

        const logger = this.logger.logger.child(ctx.info);

        // Get cards from player deck in expedition
        const cards = ctx.expedition.currentNode.data.player.cards;

        // Determine which cards to discard and which to exhaust
        const isFade = (card: IExpeditionPlayerStateDeckCard) =>
            includes(card.keywords, CardKeywordEnum.Fade);

        // Next we check if the card has the key oldEnergy greater
        // than 0, if it is true them we set the card energy to the
        // oldEnergy value
        cards.hand.forEach((card) => {
            if (card.oldEnergy > 0) card.energy = card.oldEnergy;
        });

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

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: messageType,
                action: SWARAction.MoveCard,
                data: data,
            }),
        );

        logger.info(`Discarded and exhausted all cards`);
    }
}
