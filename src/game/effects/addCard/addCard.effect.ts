import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Card } from 'src/game/components/card/card.schema';
import { CardService } from 'src/game/components/card/card.service';
import { IExpeditionPlayerStateDeckCard } from 'src/game/components/expedition/expedition.interface';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { PlayerService } from 'src/game/components/player/player.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO } from '../effects.interface';
import { addCardEffect } from './contants';

export interface AddCardArgs {
    destination: 'hand' | 'discard';
    cardId: Card['cardId'];
}

@EffectDecorator({
    effect: addCardEffect,
})
@Injectable()
export class AddCardEffect {
    constructor(
        private readonly playerService: PlayerService,
        private readonly cardService: CardService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async handle(payload: EffectDTO<AddCardArgs>): Promise<void> {
        const {
            ctx,
            args: { currentValue, destination, cardId },
        } = payload;

        const { client } = ctx;

        // First we get the combat deck
        const {
            value: {
                combatState: { cards },
            },
        } = this.playerService.get(ctx);

        // Now we get the card that we want to add to the current
        // node information
        const card = await this.cardService.findById(cardId);

        // Now we need to clone the card object x times based on the
        // currentValue parameter
        const cardsToAdd: IExpeditionPlayerStateDeckCard[] = Array(currentValue)
            .fill(card)
            .map((card) => ({
                id: randomUUID(),
                cardId: card.cardId,
                name: card.name,
                cardType: card.cardType,
                energy: card.energy,
                description: card.description,
                isTemporary: false,
                rarity: card.rarity,
                properties: card.properties,
                keywords: card.keywords,
                showPointer: card.showPointer,
                pool: card.pool,
                isUpgraded: card.isUpgraded,
            }));

        // Now we save the cards on the destination deck
        await this.expeditionService.updateHandPiles({
            clientId: client.id,
            [destination]: [...cards[destination], ...cardsToAdd],
        });

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerAffected,
                action: SWARAction.AddCard,
                data: cardsToAdd.map((card) => ({
                    destination,
                    id: card.id,
                    card,
                })),
            }),
        );
    }
}
