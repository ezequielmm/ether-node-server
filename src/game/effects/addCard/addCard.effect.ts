import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Card } from 'src/game/components/card/card.schema';
import { CardService } from 'src/game/components/card/card.service';
import { IExpeditionPlayerStateDeckCard } from 'src/game/components/expedition/expedition.interface';
import { PlayerService } from 'src/game/components/player/player.service';
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
export class AddCard {
    constructor(
        private readonly playerService: PlayerService,
        private readonly cardService: CardService,
    ) {}

    async handle(payload: EffectDTO<AddCardArgs>): Promise<void> {
        const {
            ctx,
            args: { currentValue, destination, cardId },
        } = payload;

        // First we get the combat deck
        const {
            value: {
                combatState: { cards },
            },
        } = this.playerService.get(ctx);

        // Now we get the card that we want to add to the current
        // node information
        const card = await this.cardService.findById(cardId);

        // Now we set a random uuid before adding it to the destination
        const newCard: IExpeditionPlayerStateDeckCard = {
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
        };
    }
}
