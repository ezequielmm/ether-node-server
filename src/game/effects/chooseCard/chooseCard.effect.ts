import { Injectable, Logger } from '@nestjs/common';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { chooseCardEffect } from './constants';

export enum TakeCardFromPileEnum {
    Discard = 'discard',
    Draw = 'draw',
}

export interface ChooseCardArgs {
    takeFromPile: TakeCardFromPileEnum;
}

@EffectDecorator({
    effect: chooseCardEffect,
})
@Injectable()
export class ChooseCardEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(ChooseCardEffect.name);

    async handle(payload: EffectDTO<ChooseCardArgs>): Promise<void> {
        const {
            ctx: { client, expedition },
            args: { takeFromPile, currentValue: cardsToTake },
        } = payload;

        // Here we query the desired deck based on the card played
        const {
            currentNode: {
                data: {
                    player: { cards },
                },
            },
        } = expedition;

        const cardList = cards[takeFromPile];

        // Now we send a message to the frontend to choose a card from that list
        this.logger.debug(
            `Client ${client.id} will take ${cardsToTake} cards from the ${takeFromPile} pile`,
        );

        client.emit(
            'PutData',
            JSON.stringify(
                StandardResponse.respond({
                    message_type: SWARMessageType.CombatUpdate,
                    action: SWARAction.ShowCardDialog,
                    data: {
                        cards: cardList,
                        takeFromPile,
                        cardsToTake,
                    },
                }),
            ),
        );
    }
}
