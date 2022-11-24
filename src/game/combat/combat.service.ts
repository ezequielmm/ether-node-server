import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { pick, random } from 'lodash';
import { Socket } from 'socket.io';
import {
    getRandomBetween,
    getRandomItemByWeight,
    removeCardsFromPile,
} from 'src/utils';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardRarityEnum } from '../components/card/card.enum';
import { CardDocument } from '../components/card/card.schema';
import { CardService } from '../components/card/card.service';
import { EnemyService } from '../components/enemy/enemy.service';
import { EnemyId } from '../components/enemy/enemy.type';
import {
    CombatTurnEnum,
    ExpeditionMapNodeTypeEnum,
    IExpeditionNodeReward,
} from '../components/expedition/expedition.enum';
import {
    CardPreview,
    CardReward,
    IExpeditionCurrentNode,
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionNode,
    Reward,
} from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PotionService } from '../components/potion/potion.service';
import { SettingsService } from '../components/settings/settings.service';
import { HARD_MODE_NODE_START, HARD_MODE_NODE_END } from '../constants';
import { StatusType } from '../status/interfaces';

@Injectable()
export class CombatService {
    constructor(
        private readonly settingsService: SettingsService,
        private readonly expeditionService: ExpeditionService,
        private readonly enemyService: EnemyService,
        private readonly potionService: PotionService,
        private readonly cardService: CardService,
    ) {}

    private node: IExpeditionNode;
    private client: Socket;

    private readonly cardRewardByNodeSubType: Map<
        ExpeditionMapNodeTypeEnum,
        number[]
    > = new Map([
        [ExpeditionMapNodeTypeEnum.CombatStandard, [0.6, 0.37, 0.03, 0.0]],
        [ExpeditionMapNodeTypeEnum.CombatElite, [0.5, 0.38, 0.09, 0.03]],
        [ExpeditionMapNodeTypeEnum.CombatBoss, [0.0, 0.0, 0.8, 0.2]],
    ]);

    private readonly goldRewardByNodeType: Map<
        ExpeditionMapNodeTypeEnum,
        () => number
    > = new Map([
        [ExpeditionMapNodeTypeEnum.Combat, () => random(10, 20)],
        [ExpeditionMapNodeTypeEnum.CombatElite, () => random(25, 35)],
        [ExpeditionMapNodeTypeEnum.CombatBoss, () => random(95, 105)],
    ]);

    async generate(
        node: IExpeditionNode,
        client: Socket,
    ): Promise<IExpeditionCurrentNode> {
        this.node = node;
        this.client = client;

        // Get initial player stats
        const { initialEnergy, maxEnergy, initialHandPileSize } =
            await this.settingsService.getSettings();

        // Get current health
        const { hpCurrent, hpMax, cards } =
            await this.expeditionService.getPlayerState({
                clientId: this.client.id,
            });

        const handCards = cards
            .sort(() => 0.5 - Math.random())
            .slice(0, initialHandPileSize);

        const drawCards = removeCardsFromPile({
            originalPile: cards,
            cardsToRemove: handCards,
        });

        const enemies = await this.getEnemies();
        const rewards = await this.getRewards();

        return {
            nodeId: this.node.id,
            completed: this.node.isComplete,
            nodeType: this.node.type,
            showRewards: false,
            data: {
                round: 0,
                playing: CombatTurnEnum.Player,
                player: {
                    energy: initialEnergy,
                    energyMax: maxEnergy,
                    handSize: initialHandPileSize,
                    hpCurrent,
                    hpMax,
                    defense: 0,
                    cards: {
                        draw: drawCards,
                        hand: handCards,
                        exhausted: [],
                        discard: [],
                    },
                    statuses: {
                        [StatusType.Buff]: [],
                        [StatusType.Debuff]: [],
                    },
                },
                enemies,
                rewards,
            },
        };
    }

    private async getEnemies(): Promise<IExpeditionCurrentNodeDataEnemy[]> {
        const enemyGroup = getRandomItemByWeight<EnemyId[]>(
            this.node.private_data.enemies.map(({ enemies }) => enemies),
            this.node.private_data.enemies.map(
                ({ probability }) => probability,
            ),
        );

        return await Promise.all(
            enemyGroup.map(async (enemyId: EnemyId) => {
                const enemy = await this.enemyService.findById(enemyId);

                let newHealth = getRandomBetween(
                    enemy.healthRange[0],
                    enemy.healthRange[1],
                );

                if (
                    HARD_MODE_NODE_START <= this.node.step &&
                    this.node.step <= HARD_MODE_NODE_END
                ) {
                    newHealth = Math.floor(newHealth * 1.5);
                }

                return {
                    id: randomUUID(),
                    defense: 0,
                    name: enemy.name,
                    enemyId: enemy.enemyId,
                    type: enemy.type,
                    category: enemy.category,
                    size: enemy.size,
                    hpCurrent: newHealth,
                    hpMax: newHealth,
                    statuses: {
                        [StatusType.Buff]: [],
                        [StatusType.Debuff]: [],
                    },
                };
            }),
        );
    }

    private async getRewards(): Promise<Reward[]> {
        // Start with the base rewards (Gold)
        const rewards: Reward[] = [
            {
                id: randomUUID(),
                type: IExpeditionNodeReward.Gold,
                amount: this.goldRewardByNodeType.get(this.node.type)() ?? 0,
                taken: false,
            },
        ];

        // Add cards to the rewards
        if (this.isCardRewardAvailable()) {
            const cards = await this.getRandomCardRewards();
            rewards.push(...cards);
        }

        // TEMP: Potions added to all combat nodes for testing
        const potion = await this.potionService.getRandomPotion();

        rewards.push({
            id: randomUUID(),
            type: IExpeditionNodeReward.Potion,
            taken: false,
            potion: pick(potion, ['potionId', 'name', 'description']),
        });

        // Removed trinkets for now

        return rewards;
    }

    private async getRandomCardRewards(): Promise<CardReward[]> {
        const cards: CardReward[] = [];

        for (let i = 0; i < 3; i++) {
            const card = await this.getRandomCardByNode();

            const cardPreview = pick(card, [
                'cardId',
                'name',
                'description',
                'energy',
                'rarity',
                'cardType',
                'pool',
                'isUpgraded',
            ]) as unknown as CardPreview;

            cardPreview.description = CardDescriptionFormatter.process(card);

            cards.push({
                id: randomUUID(),
                type: IExpeditionNodeReward.Card,
                card: cardPreview,
                taken: false,
            });
        }

        return cards;
    }

    private isCardRewardAvailable(): boolean {
        for (const type of this.cardRewardByNodeSubType.keys()) {
            if (type === this.node.subType) return true;
        }

        return false;
    }

    private async getRandomCardByNode(): Promise<CardDocument> {
        const rarity = getRandomItemByWeight(
            [
                CardRarityEnum.Common,
                CardRarityEnum.Uncommon,
                CardRarityEnum.Rare,
                CardRarityEnum.Legendary,
            ],
            this.cardRewardByNodeSubType.get(this.node.subType),
        );
        return this.cardService.getRandomCard(rarity);
    }
}
