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
import { CombatTurnEnum } from '../components/expedition/expedition.enum';
import { NodeType } from '../components/expedition/node-type';
import {
    IExpeditionCurrentNode,
    IExpeditionCurrentNodeDataEnemy,
} from '../components/expedition/expedition.interface';
import { Node } from '../components/expedition/node';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
import { PotionRarityEnum } from '../components/potion/potion.enum';
import { SettingsService } from '../components/settings/settings.service';
import { TrinketRarityEnum } from '../components/trinket/trinket.enum';
import { HARD_MODE_NODE_START, HARD_MODE_NODE_END } from '../constants';
import { RewardService } from '../reward/reward.service';
import { StatusType } from '../status/interfaces';
import { filter, shuffle, takeRight } from 'lodash';
import { Socket } from 'socket.io';
import { CardSelectionScreenService } from '../components/cardSelectionScreen/cardSelectionScreen.service';
import { MoveCardAction } from '../action/moveCard.action';
import { IMoveCard } from '../../socket/moveCard.gateway';
import { CustomException, ErrorBehavior } from '../../socket/custom.exception';
import { CardSelectionScreenOriginPileEnum } from '../components/cardSelectionScreen/cardSelectionScreen.enum';
import { CardService } from '../components/card/card.service';

@Injectable()
export class CombatService {
    constructor(
        private readonly settingsService: SettingsService,
        private readonly expeditionService: ExpeditionService,
        private readonly enemyService: EnemyService,
        private readonly rewardService: RewardService,
        private readonly cardSelectionService: CardSelectionScreenService,
        private readonly moveCardAction: MoveCardAction,
        private readonly cardService: CardService,
    ) {}

    private node: Node;
    private clientId: string;

    async generate(
        ctx: GameContext,
        node: Node,
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

        const handCards = takeRight(shuffle(cards), initialHandPileSize);

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
            trinketsToGenerate: filter(
                trinketsToGenerate,
                (trinket) => trinket !== null,
            ),
        });

        this.updatePotionChance(potionChance, shouldGeneratePotion);

        return {
            nodeId: this.node.id,
            completed: false,
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

    async handleMoveCard(ctx: GameContext, payload: string): Promise<void> {
        const client = ctx.client;
        const clientId = ctx.client.id;

        // query the information received by the frontend
        const { cardToTake } = JSON.parse(payload) as IMoveCard;

        // Get card selection item
        const cardSelection = await this.cardSelectionService.findOne({
            clientId,
        });

        if (!cardSelection)
            throw new CustomException(
                'Card selected is not available',
                ErrorBehavior.ReturnToMainMenu,
            );

        // Check if the id provided exists in the list
        if (cardSelection.cardIds.includes(cardToTake)) {
            if (
                cardSelection.originPile !=
                CardSelectionScreenOriginPileEnum.None
            ) {
                // With the right card to take, we call the move card action
                // with the right ids and the pile to take the cards
                await this.moveCardAction.handle({
                    client,
                    cardIds: [cardToTake],
                    originPile: cardSelection.originPile,
                    targetPile: 'hand',
                    callback: (card) => {
                        card.energy = 0;
                        return card;
                    },
                });
            } else {
                // If the origin pile is none, we add the new card to the deck instead of moving it
                await this.cardService.addCardToDeck(ctx, parseInt(cardToTake));
            }

            const amountToTake = cardSelection.amountToTake--;

            if (amountToTake > 0) {
                // Now we remove the id taken from the list and update
                // the custom deck
                await this.cardSelectionService.update({
                    clientId,
                    cardIds: cardSelection.cardIds.filter((card) => {
                        return card !== cardToTake;
                    }),
                    amountToTake,
                });
            } else {
                await this.cardSelectionService.deleteByClientId(clientId);
            }
        }
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
            case NodeType.CombatStandard:
                return getRandomBetween(10, 20);
            case NodeType.CombatElite:
                return getRandomBetween(25, 35);
            case NodeType.CombatBoss:
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
                case NodeType.CombatStandard:
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
                case NodeType.CombatElite:
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
                case NodeType.CombatStandard:
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
            case NodeType.CombatElite:
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
