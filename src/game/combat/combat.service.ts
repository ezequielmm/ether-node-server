import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
    getRandomBetween,
    getRandomItemByWeight,
    removeCardsFromPile,
} from 'src/utils';
import { CardRarityEnum } from '../components/card/card.enum';
import { EnemyService } from '../components/enemy/enemy.service';
import { EnemyId } from '../components/enemy/enemy.type';
import {
    CombatTurnEnum,
    ExpeditionMapNodeTypeEnum,
} from '../components/expedition/expedition.enum';
import {
    IExpeditionCurrentNode,
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionNode,
} from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
import { PotionRarityEnum } from '../components/potion/potion.enum';
import { SettingsService } from '../components/settings/settings.service';
import { TrinketRarityEnum } from '../components/trinket/trinket.enum';
import { HARD_MODE_NODE_START, HARD_MODE_NODE_END } from '../constants';
import { RewardService } from '../reward/reward.service';
import { StatusType } from '../status/interfaces';

@Injectable()
export class CombatService {
    constructor(
        private readonly settingsService: SettingsService,
        private readonly expeditionService: ExpeditionService,
        private readonly enemyService: EnemyService,
        private readonly rewardService: RewardService,
    ) {}

    private node: IExpeditionNode;
    private clientId: string;

    async generate(
        ctx: GameContext,
        node: IExpeditionNode,
    ): Promise<IExpeditionCurrentNode> {
        this.node = node;

        // Get initial player stats
        const {
            initialEnergy,
            maxEnergy,
            initialHandPileSize,
            maxCardRewardsInCombat,
        } = await this.settingsService.getSettings();

        // Get current health
        const { hpCurrent, hpMax, cards } = ctx.expedition.playerState;

        const handCards = cards
            .sort(() => 0.5 - Math.random())
            .slice(0, initialHandPileSize);

        const drawCards = removeCardsFromPile({
            originalPile: cards,
            cardsToRemove: handCards,
        });

        const {
            actConfig: { potionChance },
        } = ctx.expedition;

        const shouldGeneratePotion = getRandomBetween(1, 100) < potionChance;
        const trinketsToGenerate = [this.getTrinketRarityProbability()];

        const enemies = await this.getEnemies();
        const rewards = await this.rewardService.generateRewards({
            ctx,
            node: this.node,
            coinsToGenerate: this.generateCoins(),
            cardsToGenerate: this.getCardRarityProbability(
                maxCardRewardsInCombat,
            ),
            potionsToGenerate: shouldGeneratePotion
                ? [this.getPotionRarityProbability()]
                : [],
            trinketsToGenerate: trinketsToGenerate.filter(
                (item) => item !== null,
            ),
        });

        this.updatePotionChance(potionChance, shouldGeneratePotion);

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

    private generateCoins(): number {
        switch (this.node.subType) {
            case ExpeditionMapNodeTypeEnum.CombatStandard:
                return getRandomBetween(10, 20);
            case ExpeditionMapNodeTypeEnum.CombatElite:
                return getRandomBetween(25, 35);
            case ExpeditionMapNodeTypeEnum.CombatBoss:
                return getRandomBetween(95, 105);
            default:
                return 0;
        }
    }

    private getCardRarityProbability(
        cardsToGenerate: number,
    ): CardRarityEnum[] {
        const rarities: CardRarityEnum[] = [];

        for (let i = 1; i <= cardsToGenerate; i++) {
            switch (this.node.subType) {
                case ExpeditionMapNodeTypeEnum.CombatStandard:
                    rarities.push(
                        getRandomItemByWeight(
                            [
                                CardRarityEnum.Common,
                                CardRarityEnum.Uncommon,
                                CardRarityEnum.Rare,
                            ],
                            [0.6, 0.37, 0.03],
                        ),
                    );
                    break;
                case ExpeditionMapNodeTypeEnum.CombatElite:
                    rarities.push(
                        getRandomItemByWeight(
                            [
                                CardRarityEnum.Common,
                                CardRarityEnum.Uncommon,
                                CardRarityEnum.Rare,
                                CardRarityEnum.Legendary,
                            ],
                            [0.5, 0.38, 0.09, 0.03],
                        ),
                    );
                    break;
                case ExpeditionMapNodeTypeEnum.CombatStandard:
                    rarities.push(
                        getRandomItemByWeight(
                            [CardRarityEnum.Rare, CardRarityEnum.Legendary],
                            [0.8, 0.2],
                        ),
                    );
                    break;
            }
        }

        return rarities;
    }

    private getPotionRarityProbability(): PotionRarityEnum {
        return getRandomItemByWeight(
            [
                PotionRarityEnum.Common,
                PotionRarityEnum.Uncommon,
                PotionRarityEnum.Rare,
            ],
            [0.65, 0.25, 0.1],
        );
    }

    private getTrinketRarityProbability(): TrinketRarityEnum {
        switch (this.node.subType) {
            case ExpeditionMapNodeTypeEnum.CombatElite:
                return getRandomItemByWeight(
                    [
                        TrinketRarityEnum.Common,
                        TrinketRarityEnum.Uncommon,
                        TrinketRarityEnum.Rare,
                    ],
                    [0.5, 0.33, 0.17],
                );
            case ExpeditionMapNodeTypeEnum.CombatStandard:
                return getRandomItemByWeight(
                    [
                        TrinketRarityEnum.Common,
                        TrinketRarityEnum.Uncommon,
                        TrinketRarityEnum.Rare,
                    ],
                    [0.5, 0.33, 0.17],
                );
            default:
                return null;
        }
    }

    private async updatePotionChance(
        potionChance: number,
        shouldGeneratePotion: boolean,
    ): Promise<void> {
        if (potionChance > 0 && potionChance < 100) {
            const newPotionChance = shouldGeneratePotion
                ? Math.min(100, potionChance - 10)
                : Math.max(0, potionChance + 10);

            await this.expeditionService.updateByFilter(
                { clientId: this.clientId },
                {
                    ['actConfig.potionChance']: newPotionChance,
                },
            );
        }
    }
}
