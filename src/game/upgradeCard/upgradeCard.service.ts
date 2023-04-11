import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { filter, find } from 'lodash';
import { Socket } from 'socket.io';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { Card } from '../components/card/card.schema';
import { CardService } from '../components/card/card.service';
import { IExpeditionPlayerStateDeckCard } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';

@Injectable()
export class UpgradeCardService {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
    ) {}

    async showUpgradablePair(client: Socket, cardId: string): Promise<string> {
        if (!cardId || cardId === '') {
            this.sendInvalidCardMessage(client);
            throw new CustomException(
                `Card id: ${cardId} not found`,
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        // First we verify that the card received is an upgradable card
        // We query the deck cards of the player
        const cards = await this.getPlayerDeck(client.id);

        // Now we check if the id provided exists in the card list
        const originalCard = find(cards, { id: cardId });

        // Here we check that the card can be upgraded
        if (originalCard.isUpgraded) {
            this.sendInvalidCardMessage(client);
            throw new CustomException(
                `Card id: ${cardId} not found`,
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        // Now we get the upgraded version of the original card to send it
        // to the frontend
        const upgradedCardData = await this.cardService.findById(
            originalCard.upgradedCardId,
        );

        // now we check is we got an upgraded version of the card
        if (!upgradedCardData) {
            this.sendInvalidCardMessage(client);
            throw new CustomException(
                `Upgraded card id: ${originalCard.upgradedCardId} not found`,
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        const upgradedCard = this.generateUpgradedCardData(upgradedCardData);

        // Finally we send the pair to the frontend
        return StandardResponse.respond({
            message_type: SWARMessageType.CardUpgrade,
            action: SWARAction.UpgradablePair,
            data: {
                deck: [originalCard, upgradedCard],
            },
        });
    }

    async upgradeCard(client: Socket, cardId: string): Promise<string> {
        if (!cardId || cardId === '') {
            this.sendInvalidCardMessage(client);
            throw new CustomException(
                `Card id: ${cardId} not found`,
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        // First we verify that the card received is an upgradable card
        // We query the deck cards of the player
        const cards = await this.getPlayerDeck(client.id);

        // Now we check if the id provided exists in the card list
        const originalCard = find(cards, { id: cardId });

        // Here we check that the card can be upgraded
        if (originalCard.isUpgraded) {
            this.sendInvalidCardMessage(client);
            throw new CustomException(
                `Card id: ${cardId} not found`,
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        // Now we get the upgraded version of the original card to send it
        // to the frontend
        const upgradedCardData = await this.cardService.findById(
            originalCard.upgradedCardId,
        );

        // now we check is we got an upgraded version of the card
        if (!upgradedCardData) {
            this.sendInvalidCardMessage(client);
            throw new CustomException(
                `Upgraded card id: ${originalCard.upgradedCardId} not found`,
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        const upgradedCard = this.generateUpgradedCardData(upgradedCardData);

        // Now we set the card on the deck and remove the previous one
        const newDeck = filter(cards, (card) => card.id !== cardId);

        // Now we add the card to the deck
        newDeck.push(upgradedCard);

        // finally we save the information on the database
        await this.expeditionService.updatePlayerDeck({
            clientId: client.id,
            deck: newDeck,
        });

        // next we send a message to the frontned to showw the animation
        return StandardResponse.respond({
            message_type: SWARMessageType.CardUpgrade,
            action: SWARAction.ConfirmUpgrade,
            data: {
                cardIdToDelete: originalCard.id,
                newCard: upgradedCard,
            },
        });
    }

    private async getPlayerDeck(
        clientId: string,
    ): Promise<IExpeditionPlayerStateDeckCard[]> {
        return await this.expeditionService.getDeckCards({ clientId });
    }

    private sendInvalidCardMessage(client: Socket): void {
        client.emit(
            'ErrorMessage',
            StandardResponse.respond({
                message_type: SWARMessageType.Error,
                action: SWARAction.InvalidCard,
                data: null,
            }),
        );
    }

    private generateUpgradedCardData(
        upgradedCard: Card,
    ): IExpeditionPlayerStateDeckCard {
        upgradedCard.description = CardDescriptionFormatter.process(upgradedCard);
        this.cardService.addStatusDescriptions(upgradedCard);

        return {
            id: randomUUID(),
            cardId: upgradedCard.cardId,
            name: upgradedCard.name,
            cardType: upgradedCard.cardType,
            energy: upgradedCard.energy,
            description: upgradedCard.description,
            isTemporary: false,
            rarity: upgradedCard.rarity,
            properties: upgradedCard.properties,
            keywords: upgradedCard.keywords,
            showPointer: upgradedCard.showPointer,
            pool: upgradedCard.pool,
            isUpgraded: upgradedCard.isUpgraded,
            isActive: true,
        };
    }
}
