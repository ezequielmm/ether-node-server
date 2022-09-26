import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { CardService } from 'src/game/components/card/card.service';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { corsSocketSettings } from './socket.enum';

@WebSocketGateway(corsSocketSettings)
export class CampGateway {
    private readonly logger: Logger = new Logger(CampGateway.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
    ) {}

    @SubscribeMessage('CampRecoverHealth')
    async handleRecoverHealth(client: Socket): Promise<string> {
        this.logger.debug(
            `Client ${client.id} trigger message "RecoverHealth"`,
        );

        // First we get the actual player state to get the
        // actual health and max health for the player
        const { hpCurrent, hpMax } =
            await this.expeditionService.getPlayerState({
                clientId: client.id,
            });

        // Now we calculate the new health for the player
        // Here we increase the health by 30% or set it to the
        // hpMax value is the result is higher than hpMax
        const newHp = Math.floor(Math.min(hpMax, hpCurrent + hpCurrent * 0.3));

        // now we update the current hp for the player, as is just update
        // we do it on the player state directly
        await this.expeditionService.updateByFilter(
            { clientId: client.id },
            { playerState: { hpCurrent: newHp } },
        );

        // Now we return the message to let the frontend know the new
        // health
        return StandardResponse.respond({
            message_type: SWARMessageType.CampUpdate,
            action: SWARAction.IncreasePlayerHealth,
            data: { newHp },
        });
    }

    @SubscribeMessage('CampShowPlayerDeck')
    async handleShowPlayerDeck(client: Socket): Promise<string> {
        this.logger.debug(
            `Client ${client.id} trigger message "ShowUpgradeCard"`,
        );

        // First we get the cards from the deck and send them to the
        // frontend
        const { cards } = await this.expeditionService.getPlayerState({
            clientId: client.id,
        });

        return StandardResponse.respond({
            message_type: SWARMessageType.CampUpdate,
            action: SWARAction.ShowPlayerDeck,
            data: { cards },
        });
    }

    @SubscribeMessage('CampUpgradeCard')
    async handleUpgradeCard(client: Socket, cardId: string): Promise<void> {
        // First we get the player deck to confirm that the card exists
        const playerDeck = await this.expeditionService.getDeckCards({
            clientId: client.id,
        });

        // Now we check if the card id provided by the frontend exists
        // On the player's deck and is not already upgraded
        const cardToUpgrade = playerDeck.find((card) => {
            return card.id === cardId && !card.isUpgraded;
        });

        if (cardToUpgrade !== null) {
            // is cardToUpgrade is not null, it means that the card exists and we can upgrade it
            // Now we deeestructure the card object to get the id of the upgraded card
            const { upgradedCardId } = cardToUpgrade;

            // Now we search for it on the database and copy it to the deck
            const newCard = await this.cardService.findById(upgradedCardId);

            // Now we create the new card on the player's deck and remove the old card
            playerDeck.push({
                id: randomUUID(),
                isTemporary: false,
                ...newCard,
            });

            const newDeck = playerDeck.filter((card) => {
                return card.id !== cardId;
            });

            // Now we update the deck on the database
            await this.expeditionService.updatePlayerDeck({
                clientId: client.id,
                deck: newDeck,
            });

            // TODO: how to inform the frontend the new changes
        }
    }
}
