import { Injectable } from '@nestjs/common';
import { DiscardAllCardsAction } from 'src/game/action/discardAllCards.action';
import { DrawCardAction } from 'src/game/action/drawCard.action';
import { SWARMessageType } from 'src/game/standardResponse/standardResponse';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { repositionEffect } from './contants';

@EffectDecorator({
    effect: repositionEffect,
})
@Injectable()
export class RepositionEffect implements EffectHandler {
    constructor(
        private readonly discardAllCardsAction: DiscardAllCardsAction,
        private readonly drawCardAction: DrawCardAction,
    ) {}

    async handle(payload: EffectDTO): Promise<void> {
        // Here we get the client Socket and the cards from the
        // current node object
        const {
            ctx: {
                client,
                expedition: {
                    currentNode: {
                        data: {
                            player: {
                                cards: { hand },
                            },
                        },
                    },
                },
            },
        } = payload;

        // This is just to send the correct message type across the effect
        const SWARMessageTypeToSend = SWARMessageType.PlayerAffected;

        // Here we get how many cards we currently have
        // in the hand pile
        const cardsToDrawBack = hand.length;

        // Now we move all those cards to the discard pile
        await this.discardAllCardsAction.handle({
            client,
            SWARMessageTypeToSend,
        });

        // Now, we take the amount of cards we had on the hand pile
        // from the draw pile
        await this.drawCardAction.handle({
            client,
            amountToTake: cardsToDrawBack,
            cardType: undefined,
            SWARMessageTypeToSend,
        });
    }
}
