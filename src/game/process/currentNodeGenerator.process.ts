import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { map, pick, random } from 'lodash';
import {
    getRandomBetween,
    getRandomItemByWeight,
    removeCardsFromPile,
} from 'src/utils';
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
import { StatusType } from '../status/interfaces';

@Injectable()
export class CurrentNodeGeneratorProcess {
    private node: IExpeditionNode;
    private clientId: string;

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

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly settingsService: SettingsService,
        private readonly enemyService: EnemyService,
        private readonly potionService: PotionService,
        private readonly cardService: CardService,
    ) {}

    async getCurrentNodeData(
        node: IExpeditionNode,
        clientId: string,
    ): Promise<IExpeditionCurrentNode> {
        this.node = node;
        this.clientId = clientId;

        const combatNodes = this.filterNodeTypes('combat');

        if (combatNodes.includes(node.type)) {
            return await this.getCombatCurrentNode();
        } else {
            return this.getCurrentNode();
        }
    }

    private getNodeTypes(): string[] {
        return Object.values(ExpeditionMapNodeTypeEnum);
    }

    private filterNodeTypes(filterValue: string): string[] {
        const nodesTypes = this.getNodeTypes();
        return nodesTypes.filter((node) => node.search(filterValue) !== -1);
    }

    private async getCombatCurrentNode(): Promise<IExpeditionCurrentNode> {
        const { initialEnergy, maxEnergy, initialHandPileSize } =
            await this.settingsService.getSettings();

        // Get all the deck cards
        const cards = await this.expeditionService.getDeckCards({
            clientId: this.clientId,
        });

        // Get current health
        const { hpCurrent, hpMax } =
            await this.expeditionService.getPlayerState({
                clientId: this.clientId,
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

    private getCurrentNode(): IExpeditionCurrentNode {
        return {
            nodeId: this.node.id,
            completed: false,
            nodeType: this.node.type,
            showRewards: false,
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

                const newHealth = getRandomBetween(
                    enemy.healthRange[0],
                    enemy.healthRange[1],
                );

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

        return rewards;
    }

    private async getRandomCardRewards(): Promise<CardReward[]> {
        const cards: CardReward[] = [];

        for (let i = 0; i < 3; i++) {
            const card = await this.getRandomCardByNode();

            cards.push({
                id: randomUUID(),
                type: IExpeditionNodeReward.Card,
                card: pick(card, [
                    'cardId',
                    'name',
                    'description',
                    'energy',
                    'rarity',
                    'cardType',
                    'pool',
                ]) as unknown as CardPreview,
                taken: false,
            });
        }

        return cards;
    }
    private isCardRewardAvailable(): boolean {
        for (const type of this.cardRewardByNodeSubType.keys()) {
            if (type === this.node.subType) {
                return true;
            }
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
