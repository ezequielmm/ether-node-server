import * as _ from 'lodash';
import { CardDocument } from 'src/game/components/card/card.schema';
import { CardService } from 'src/game/components/card/card.service';
import { TrinketService } from 'src/game/components/trinket/trinket.service';
import { CardRarityEnum, CardTypeEnum } from 'src/game/components/card/enums';
import { ExpeditionMapNodeTypeEnum } from 'src/game/expedition/enums';
import { getApp } from 'src/main';
import Node from '../node';
import { TrinketRarityEnum } from 'src/game/components/trinket/enums';
import { PotionService } from 'src/game/components/potion/potion.service';
import { PotionRarityEnum } from 'src/game/components/potion/enums';

class Merchant extends Node {
    constructor(
        id: number,
        act: number,
        step: number,
        type: ExpeditionMapNodeTypeEnum,
        subType: ExpeditionMapNodeTypeEnum,
        private_data: any,
    ) {
        super(id, act, step, type, subType, private_data);
    }

    private static CardCostByRarity: { [key: string]: () => number } = {
        [CardRarityEnum.Common]: () => _.random(45, 55),
        [CardRarityEnum.Uncommon]: () => _.random(68, 82),
        [CardRarityEnum.Rare]: () => _.random(135, 165),
    };

    private static TrinketCostByRarity: { [key: string]: () => number } = {
        [TrinketRarityEnum.Common]: () => _.random(143, 157),
        [TrinketRarityEnum.Uncommon]: () => _.random(238, 262),
        [TrinketRarityEnum.Rare]: () => _.random(285, 315),
    };

    private static PotionCostByRarity: { [key: string]: () => number } = {
        [PotionRarityEnum.Common]: () => _.random(48, 52),
        [PotionRarityEnum.Uncommon]: () => _.random(72, 78),
        [PotionRarityEnum.Rare]: () => _.random(95, 105),
    };

    public async stateInitialize(): Promise<any> {
        this.state = {
            cards: await this.getRandomCards(),
            trinkets: await this.getRandomsTrinkets(),
            potions: await this.getRandomsPotions(),
        };

        return this.state;
    }

    private async getRandomCards(): Promise<
        { card_id: string; cost: number }[]
    > {
        const app = getApp();
        const cardService = app.get(CardService);

        const attackCards = await cardService.findByType(CardTypeEnum.Attack);
        const defenseCards = await cardService.findByType(CardTypeEnum.Defend);
        const skillCards = await cardService.findByType(CardTypeEnum.Skill);
        const powerCards = await cardService.findByType(CardTypeEnum.Power);

        const cards: CardDocument[] = [
            ..._.sampleSize(attackCards, 2),
            ..._.sampleSize(defenseCards, 1),
            ..._.sampleSize(skillCards, 1),
            ..._.sampleSize(powerCards, 1),
        ];

        return cards.map(({ id, rarity }) => ({
            card_id: id,
            cost: Merchant.CardCostByRarity[rarity](),
        }));
    }

    private async getRandomsTrinkets(): Promise<
        { trinket_id: string; cost: number }[]
    > {
        const app = getApp();
        const trinketService = app.get(TrinketService);

        const trinkets = await trinketService.findAll();

        return _.sampleSize(trinkets, 3).map(({ id, rarity }) => ({
            trinket_id: id,
            cost: Merchant.TrinketCostByRarity[rarity](),
        }));
    }

    private async getRandomsPotions(): Promise<
        { potion_id: string; cost: number }[]
    > {
        const app = getApp();
        const potionService = app.get(PotionService);

        const potions = await potionService.findAll();

        return _.sampleSize(potions, 3).map(({ id, rarity }) => ({
            potion_id: id,
            cost: Merchant.PotionCostByRarity[rarity](),
        }));
    }
}

export default Merchant;
