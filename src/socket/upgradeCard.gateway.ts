import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { CardDescriptionFormatter } from 'src/game/cardDescriptionFormatter/cardDescriptionFormatter';
import { CardService } from 'src/game/components/card/card.service';
import { IExpeditionPlayerStateDeckCard } from 'src/game/components/expedition/expedition.interface';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import {
    SWARAction,
    StandardResponse,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { corsSocketSettings } from './socket.enum';

@WebSocketGateway(corsSocketSettings)
export class UpgradeCardGateway {
    private readonly logger: Logger = new Logger(UpgradeCardGateway.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
    ) {}

    @SubscribeMessage('CardUpgradeSelected')
    async handleCardUpgradeSelected(
        client: Socket,
        cardId: string,
    ): Promise<string> {
        this.logger.debug(
            `Client ${client.id} trigger message "CardUpgradeSelected": cardId: ${cardId}`,
        );

        if (!cardId || cardId === '') {
            this.logger.debug(`Card is invalid: ${cardId}`);
            this.sendInvalidCardMessage(client);
            return;
        }

        // First we verify that the card received is an upgradable card
        // We query the deck cards of the player
        const cards = await this.expeditionService.getDeckCards({
            clientId: client.id,
        });

        // Now we check if the id provided exists in the card list
        const originalCard = cards.find(({ id }) => {
            return id === cardId;
        });

        // Here we check that the card can be upgraded
        if (originalCard.isUpgraded) {
            this.logger.debug(`Card is already upgraded: ${cardId}`);
            this.sendInvalidCardMessage(client);
            return;
        }

        // Now we get the upgraded version of the original card to send it
        // to the frontend
        const upgradedCardData = await this.cardService.findById(
            originalCard.upgradedCardId,
        );

        if (!upgradedCardData) {
            this.logger.debug(`Upgrade not found: ${cardId}`);
            this.sendInvalidCardMessage(client);
            return;
        }

        const upgradedCard: IExpeditionPlayerStateDeckCard = {
            id: randomUUID(),
            cardId: upgradedCardData.cardId,
            name: upgradedCardData.name,
            cardType: upgradedCardData.cardType,
            energy: upgradedCardData.energy,
            description: CardDescriptionFormatter.process(upgradedCardData),
            isTemporary: false,
            rarity: upgradedCardData.rarity,
            properties: upgradedCardData.properties,
            keywords: upgradedCardData.keywords,
            showPointer: upgradedCardData.showPointer,
            pool: upgradedCardData.pool,
            isUpgraded: upgradedCardData.isUpgraded,
            isActive: true,
        };

        // Finally we send the pair to the frontend
        return StandardResponse.respond({
            message_type: SWARMessageType.CardUpgrade,
            action: SWARAction.UpgradablePair,
            data: {
                deck: [originalCard, upgradedCard],
            },
        });
    }

    @SubscribeMessage('UpgradeCard')
    async handleUpgradeCard(client: Socket, cardId: string): Promise<string> {
        this.logger.debug(
            `Client ${client.id} trigger message "UpgradeCard": cardId: ${cardId}`,
        );

        if (!cardId || cardId === '') {
            this.sendInvalidCardMessage(client);
            return;
        }

        if (!cardId || cardId === '') {
            this.sendInvalidCardMessage(client);
            return;
        }

        // First we verify that the card received is an upgradable card
        // We query the deck cards of the player
        const cards = await this.expeditionService.getDeckCards({
            clientId: client.id,
        });

        // Now we check if the id provided exists in the card list
        const originalCard = cards.find(({ id }) => {
            return id === cardId;
        });

        // Here we check that the card can be upgraded
        if (originalCard.isUpgraded) {
            this.sendInvalidCardMessage(client);
            return;
        }

        // Now we get the upgraded version of the original card to send it
        // to the frontend
        const upgradedCardData = await this.cardService.findById(
            originalCard.upgradedCardId,
        );

        const upgradedCard: IExpeditionPlayerStateDeckCard = {
            id: randomUUID(),
            cardId: upgradedCardData.cardId,
            name: upgradedCardData.name,
            cardType: upgradedCardData.cardType,
            energy: upgradedCardData.energy,
            description: CardDescriptionFormatter.process(upgradedCardData),
            isTemporary: false,
            rarity: upgradedCardData.rarity,
            properties: upgradedCardData.properties,
            keywords: upgradedCardData.keywords,
            showPointer: upgradedCardData.showPointer,
            pool: upgradedCardData.pool,
            isUpgraded: upgradedCardData.isUpgraded,
            isActive: true,
        };

        // Now we set the card on the deck and remove the previous one
        const newDeck = cards.filter((card) => {
            return card.id !== cardId;
        });

        newDeck.push(upgradedCard);

        // finally we save the information on the database
        await this.expeditionService.updatePlayerDeck({
            clientId: client.id,
            deck: newDeck,
        });

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.CampUpdate,
                action: SWARAction.FinishCamp,
                data: {},
            }),
        );

        // next we send a message to the frontned to showw the animation
        return StandardResponse.respond({
            message_type: SWARMessageType.CardUpgrade,
            action: SWARAction.ConfirmUpgrade,
            data: {
                cardIdToDelete: originalCard.id,
                newCard: upgradedCard,
            },
        });

        // TODO: add validation to confirm if the user can upgrade more cards
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
}
