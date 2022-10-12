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
    ): Promise<void> {
        this.logger.debug(
            `Client ${client.id} trigger message "UpgradeCard": cardId: ${cardId}`,
        );

        if (!cardId || cardId === '') {
            client.emit(
                'ErrorMessage',
                StandardResponse.respond({
                    message_type: SWARMessageType.Error,
                    action: SWARAction.InvalidCard,
                    data: null,
                }),
            );
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
        };

        // Finally we send the pair to the frontend
        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.GenericData,
                action: SWARAction.UpgradablePair,
                data: {
                    originalCard,
                    upgradedCard,
                },
            }),
        );
    }
}
