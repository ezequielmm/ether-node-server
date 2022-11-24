import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { getRandomBetween } from 'src/utils';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardRarityEnum, CardTypeEnum } from '../components/card/card.enum';
import { CardDocument } from '../components/card/card.schema';
import { CardService } from '../components/card/card.service';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PotionRarityEnum } from '../components/potion/potion.enum';
import { PotionService } from '../components/potion/potion.service';
import {
    PotionCommon,
    PotionUncommon,
    PotionRare,
    ItemsTypeEnum,
    CardCommon,
    CardRare,
    CardUncommon,
} from './merchant.enum';
import { Item, MerchantItems, SelectedItem } from './merchant.interface';

@Injectable()
export class MerchantService {
    private readonly logger: Logger = new Logger(MerchantService.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly potionService: PotionService,
    ) {}

    private client: Socket;

    async generateMerchant(): Promise<MerchantItems> {
        const potions = await this.getPotions();
        const cards = await this.getCards();

        return {
            cards,
            potions,
            trinkets: [],
        };
    }

    async processItem(
        client: Socket,
        selectedItem: SelectedItem,
    ): Promise<void> {
        switch (selectedItem.type) {
            case ItemsTypeEnum.Card:
            case ItemsTypeEnum.Trinket:
            case ItemsTypeEnum.Potion:
                break;
        }
    }

    private async getPotions(): Promise<Item[]> {
        const potions = await this.potionService.randomPotion(5);

        const itemsData: Item[] = [];

        for (const potion of potions) {
            let cost: number = null;

            switch (potion.rarity) {
                case PotionRarityEnum.Common:
                    cost = getRandomBetween(
                        PotionCommon.minPrice,
                        PotionCommon.maxPrice,
                    );
                    break;
                case PotionRarityEnum.Uncommon:
                    cost = getRandomBetween(
                        PotionUncommon.minPrice,
                        PotionUncommon.maxPrice,
                    );
                    break;
                case PotionRarityEnum.Rare:
                    cost = getRandomBetween(
                        PotionRare.minPrice,
                        PotionRare.maxPrice,
                    );
                    break;
            }

            const itemId = randomUUID();

            itemsData.push({
                id: itemId,
                isSold: false,
                itemId: potion.potionId,
                cost,
                type: ItemsTypeEnum.Potion,
                item: {
                    potionId: potion.potionId,
                    name: potion.name,
                    rarity: potion.rarity,
                    description: potion.description,
                    effects: potion.effects,
                    usableOutsideCombat: potion.usableOutsideCombat,
                    showPointer: potion.showPointer,
                    id: itemId,
                    isActive: true,
                },
            });
        }

        return itemsData;
    }

    private async getCards(): Promise<Item[]> {
        const attackCard = await this.cardService.randomCards(
            2,
            CardTypeEnum.Attack,
        );

        const defenseCard = await this.cardService.randomCards(
            1,
            CardTypeEnum.Defend,
        );

        const skillCard = await this.cardService.randomCards(
            1,
            CardTypeEnum.Skill,
        );

        const powerCard = await this.cardService.randomCards(
            2,
            CardTypeEnum.Power,
        );

        const cards: CardDocument[] = [
            ...attackCard,
            ...defenseCard,
            ...skillCard,
            ...powerCard,
        ];

        const itemsData: Item[] = [];

        for (const card of cards) {
            let cost: number = null;

            switch (card.rarity) {
                case CardRarityEnum.Common:
                    cost = getRandomBetween(
                        CardCommon.minPrice,
                        CardCommon.maxPrice,
                    );
                    break;
                case CardRarityEnum.Uncommon:
                    cost = getRandomBetween(
                        CardUncommon.minPrice,
                        CardUncommon.maxPrice,
                    );
                    break;
                case CardRarityEnum.Rare:
                    cost = getRandomBetween(
                        CardRare.minPrice,
                        CardRare.maxPrice,
                    );
                    break;
            }

            const itemId = randomUUID();

            itemsData.push({
                isSale: false,
                id: itemId,
                isSold: false,
                itemId: card.cardId,
                cost,
                type: ItemsTypeEnum.Card,
                item: {
                    id: itemId,
                    cardId: card.cardId,
                    name: card.name,
                    rarity: card.rarity,
                    cardType: card.cardType,
                    pool: card.pool,
                    energy: card.energy,
                    description: CardDescriptionFormatter.process(card),
                    isTemporary: false,
                    properties: card.properties,
                    keywords: card.keywords,
                    showPointer: card.showPointer,
                    isUpgraded: card.isUpgraded,
                    upgradedCardId: card.upgradedCardId,
                    isActive: true,
                },
            });
        }

        const randomIndex: number = getRandomBetween(0, itemsData.length);

        itemsData[randomIndex] = {
            ...itemsData[randomIndex],
            isSale: true,
            cost: Math.floor(itemsData[randomIndex].cost / 2),
        };

        return itemsData;
    }
}
