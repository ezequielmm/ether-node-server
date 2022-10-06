import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { CardService } from '../components/card/card.service';
import { ExpeditionService } from '../components/expedition/expedition.service';

interface UpgradeCardDTO {
    client: Socket;
    cardId: string;
}

@Injectable()
export class UpgradeCardAction {
    private readonly logger: Logger = new Logger(UpgradeCardAction.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
    ) {}

    async handle(payload: UpgradeCardDTO): Promise<void> {
        const { client, cardId } = payload;

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
            // Now we deestructure the card object to get the id of the upgraded card
            const { upgradedCardId } = cardToUpgrade;

            // Now we search for it on the database and copy it to the deck
            const newCard = await this.cardService.findById(upgradedCardId);

            // Now we create the new card on the player's deck and remove the old card
            playerDeck.push({
                id: randomUUID(),
                isTemporary: false,
                ...newCard,
            });

            this.logger.verbose(
                `Added card ${newCard.name} to player's deck: ${client.id}`,
            );

            const newDeck = playerDeck.filter((card) => {
                return card.id !== cardId;
            });

            this.logger.verbose(
                `Removed card ${cardId} from player's deck: ${client.id}`,
            );

            // Now we update the deck on the database
            await this.expeditionService.updatePlayerDeck({
                clientId: client.id,
                deck: newDeck,
            });
        }
    }
}
