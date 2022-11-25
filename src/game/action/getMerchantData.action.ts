import { Injectable } from '@nestjs/common';
import { CardService } from '../components/card/card.service';
import { ExpeditionService } from '../components/expedition/expedition.service';

@Injectable()
export class GetMerchantDataAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
    ) {}

    async handle(clientId: string) {
        const {
            playerState,
            playerState: { cards },
            currentNode: { merchantItems },
        } = await this.expeditionService.findOne({
            clientId,
        });

        const data = {
            coins: playerState.gold,
            shopkeeper: 1,
            speechBubble: 'Hello',
            upgradeableCards: [],
            upgradedCards: [],
            playerCards: cards,
            upgradeCost: 75 + 25 * playerState.cardUpgradeCount,
            destroyCost: 75 + 25 * playerState.cardDestroyCount,
            cards: merchantItems.cards,
            neutralCards: [],
            trinkets: merchantItems.trinkets,
            potions: merchantItems.potions,
        };

        return data;
    }
}
