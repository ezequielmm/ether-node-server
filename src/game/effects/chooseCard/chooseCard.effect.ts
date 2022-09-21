import { Injectable, Logger } from '@nestjs/common';
import { CardSelectionScreenOriginPileEnum } from 'src/game/components/cardSelectionScreen/cardSelectionScreen.enum';
import { CardSelectionScreenService } from 'src/game/components/cardSelectionScreen/cardSelectionScreen.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { chooseCardEffect } from './constants';

export interface ChooseCardArgs {
    originPile: CardSelectionScreenOriginPileEnum;
}

@EffectDecorator({
    effect: chooseCardEffect,
})
@Injectable()
export class ChooseCardEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(ChooseCardEffect.name);

    constructor(
        private readonly cardSelectionScreenService: CardSelectionScreenService,
    ) {}

    async handle(payload: EffectDTO<ChooseCardArgs>): Promise<void> {
        const {
            ctx: { client, expedition },
            args: { originPile, currentValue: cardsToTake },
        } = payload;

        // Here we query the desired deck based on the card played
        const {
            currentNode: {
                data: {
                    player: { cards },
                },
            },
        } = expedition;

        const cardList =
            originPile === CardSelectionScreenOriginPileEnum.Discard
                ? cards.discard
                : cards.draw;

        // Now we send a message to the frontend to choose a card from that list
        this.logger.debug(
            `Client ${client.id} will take ${cardsToTake} cards from the ${originPile} pile`,
        );

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.CombatUpdate,
                action: SWARAction.ShowCardDialog,
                data: {
                    cards: cardList,
                    cardsToTake,
                },
            }),
        );

        // Here we create an item on the card selection screen collection
        // to make sure that we only receive the desired data
        await this.cardSelectionScreenService.create({
            clientId: client.id,
            cardIds: cardList.map(({ id }) => {
                return id;
            }),
            originPile,
            amount: cardsToTake,
        });
    }
}
