import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
    IntentCooldown,
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
import { CardSelectionScreenService } from '../components/cardSelectionScreen/cardSelectionScreen.service';
import { MoveCardAction } from '../action/moveCard.action';
import { IMoveCard } from '../../socket/moveCard.gateway';
import { CustomException, ErrorBehavior } from '../../socket/custom.exception';
import { CardSelectionScreenOriginPileEnum } from '../components/cardSelectionScreen/cardSelectionScreen.enum';
import { CardService } from '../components/card/card.service';
import { PlayerService } from '../components/player/player.service';
import { ExpeditionEntity } from '../components/interfaces';
import { CardTargetedEnum } from '../components/card/card.enum';
import { IActNodeOption } from '../map/builder/mapBuilder.interface';
import { EnemySizeEnum } from '../components/enemy/enemy.enum';
import { MoldCard } from '../components/card/data/mold.card';

@Injectable()
export class CombatService {
    constructor(
        private readonly settingsService: SettingsService,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        private readonly enemyService: EnemyService,
        private readonly rewardService: RewardService,
        private readonly cardSelectionService: CardSelectionScreenService,
        private readonly moveCardAction: MoveCardAction,
        private readonly cardService: CardService,
        private readonly playerService: PlayerService,
    ) {}

    async generateRewards(nodeOption, act?: number, ctx?: GameContext | null) {
        const { maxCardRewardsInCombat, initialPotionChance } =
            await this.settingsService.getSettings();

        const trinketsToGenerate = [
            this.getTrinketRarityProbability(nodeOption),
        ];

        const potionsToGenerate =
            initialPotionChance / 100 < Math.random()
                ? [this.getPotionRarityProbability()]
                : [];

        return await this.rewardService.generateRewards({
            ctx: ctx,
            coinsToGenerate: this.generateCoins(nodeOption.subType),
            cardsToGenerate: this.getCardRarityProbability(
                nodeOption.subType,
                maxCardRewardsInCombat,
            ),
            potionsToGenerate: potionsToGenerate,
            trinketsToGenerate: filter(
                trinketsToGenerate,
                (trinket) => trinket !== null,
            ),
            upgradeCards: (act ?? 1) > 1,
        });
    }

    async generateBaseState(nodeOption: IActNodeOption, act: number) {
        const enemies = [];

        for await (const enemyId of nodeOption.nodeConfig.enemies) {
            const enemy = await this.getNewEnemyById(enemyId, nodeOption.nodeConfig.healthMultiplier ?? 1);
            enemies.push(enemy);
        }

        const sortedByLineEnemies = this.sortEnemiesByLine(enemies);
        const rewards = await this.generateRewards(nodeOption, act);

        return {
            enemies: sortedByLineEnemies,
            rewards,
        };
    }

    async generate(ctx: GameContext, node: Node): Promise<IExpeditionCurrentNode> {
        
        // Get initial player stats
        const { initialEnergy, maxEnergy, initialHandPileSize } = await this.settingsService.getSettings();

        // Get current health
        const { hpCurrent, hpMax, cards } = ctx.expedition.playerState;

        // Set card old energy value to 0
        cards.forEach((card) => {
            card.oldEnergy = 0;
        });

        const shuffledCards = shuffle(cards);
        const handCards = takeRight(shuffledCards, initialHandPileSize);

        const moldcardCount = handCards.filter(x => x.cardId == MoldCard.cardId).length;

        const drawCards = removeCardsFromPile({
            originalPile: shuffledCards,
            cardsToRemove: handCards,
        });

        const enemies: IExpeditionCurrentNodeDataEnemy[] = node.private_data.enemies;
        const sortedEnemies = this.sortEnemiesByLine(enemies);

        const rewards = await this.rewardService.liveUpdateRewards(
            ctx,
            node.private_data.rewards,
        );

        return {
            nodeId: node.id,
            completed: false,
            nodeType: node.type,
            nodeSubType: node.subType,
            showRewards: false,
            data: {
                round: 0,
                playing: CombatTurnEnum.Player,
                player: {
                    energy: Math.max(initialEnergy - moldcardCount, 0),
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
                enemies: sortedEnemies,
                rewards,
            },
        };
    }

    private getNumericEnemySize(enemy:IExpeditionCurrentNodeDataEnemy):number{
        switch(enemy.size){
            case EnemySizeEnum.Small:
                return 1;
            case EnemySizeEnum.Medium:
                return 2;
            case EnemySizeEnum.Large:
                return 3;
            case EnemySizeEnum.Giant:
                return 4;
        }
    }

    private sortEnemiesBySize(enemies:IExpeditionCurrentNodeDataEnemy[]):IExpeditionCurrentNodeDataEnemy[]{
        const sizeOrder: { [size: string]: number } = {
            'giant': 0,
            'large': 1,
            'medium': 2,
            'small': 3,
        };

        return enemies.sort((a, b) => sizeOrder[a.size] - sizeOrder[b.size]);
    }

    public sortEnemiesByLine(enemies:IExpeditionCurrentNodeDataEnemy[]):IExpeditionCurrentNodeDataEnemy[] {

        const orderedEnemies = this.sortEnemiesBySize(enemies);
        let lines : { places: number; enemies: IExpeditionCurrentNodeDataEnemy[] } [] = [
            { places: 10, enemies: [] },
            { places: 4, enemies: [] },
        ];

        orderedEnemies.forEach(enemy => {
            const enemySize = this.getNumericEnemySize(enemy);
            const suitableLine = lines.find((line) => enemySize <= line.places);

            if (suitableLine) {
                suitableLine.enemies.push({ ...enemy, line: lines.indexOf(suitableLine) });
                suitableLine.places -= enemySize;
            }else{
                console.log("The node was created incorrectly.")
                console.log("The enemy " + enemy.enemyId +" does not enter any line.");
            }
        })

        return lines.flatMap((line) => line.enemies);
    }

    public hasSpaceToSpawnEnemy(enemies: IExpeditionCurrentNodeDataEnemy[], newEnemies:IExpeditionCurrentNodeDataEnemy[]): boolean{
        const combinedEnemies = enemies.concat(newEnemies);

        const orderedEnemies = this.sortEnemiesBySize(combinedEnemies);
        let lines : { places: number; enemies: IExpeditionCurrentNodeDataEnemy[] } [] = [
            { places: 4, enemies: [] },
            { places: 4, enemies: [] },
        ];

        let hasSpace = true;
        orderedEnemies.forEach(enemy => {
            const enemySize = this.getNumericEnemySize(enemy);
            const suitableLine = lines.find((line) => enemySize <= line.places);

            if (suitableLine) {
                suitableLine.enemies.push({ ...enemy, line: lines.indexOf(suitableLine) });
                suitableLine.places -= enemySize;
            }else{
                return false;
            }
        });

        return hasSpace;
    }

    async handleMoveCard(ctx: GameContext, payload: string): Promise<void> {
        const client = ctx.client;
        const clientId = ctx.client.id;

        // query the information received by the frontend
        const { cardsToTake } = JSON.parse(payload) as IMoveCard;

        // Get card selection item
        const cardSelection = await this.cardSelectionService.findOne({
            clientId,
        });

        if (!cardSelection)
            throw new CustomException(
                'Card selected is not available',
                ErrorBehavior.ReturnToMainMenu,
            );

        for (const cardToTake of cardsToTake) {
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
                    await this.cardService.addCardToDeck(
                        ctx,
                        parseInt(cardToTake),
                    );
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
                    return;
                }
            }
        }
    }

    async getNewEnemyById(enemyId: EnemyId, healthMultiplier = 1): Promise<IExpeditionCurrentNodeDataEnemy> {
        const enemy = await this.enemyService.findById(enemyId);
        const newHealth = Math.floor(getRandomBetween(enemy.healthRange[0], enemy.healthRange[1]) * healthMultiplier);

        let cooldowns: IntentCooldown[] = [];
        enemy.attackLevels?.forEach(level => {
            level.options.forEach(option => {
                cooldowns.push({idIntent: option.id, cooldown: option.cooldown});
            })
        });

        let newEnemy:IExpeditionCurrentNodeDataEnemy = {
            id: randomUUID(),
            defense: 0,
            name: enemy.name,
            enemyId: enemy.enemyId,
            type: enemy.type,
            category: enemy.category,
            size: enemy.size,
            hpCurrent: newHealth,
            hpMax: newHealth,
            line: 0,
            statuses: {
                [StatusType.Buff]: [],
                [StatusType.Debuff]: [],
            },
        };

        if(enemy.aggressiveness){
            newEnemy.aggressiveness = enemy.aggressiveness;
            newEnemy.intentCooldowns = cooldowns;
        }

        return newEnemy;
    }

    private generateCoins(nodeType: NodeType): number {
        switch (nodeType) {
            case NodeType.Combat:
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
        type: NodeType,
        cardsToGenerate: number,
    ): CardRarityEnum[] {
        const rarities: CardRarityEnum[] = [];

        for (let i = 1; i <= cardsToGenerate; i++) {
            switch (type) {
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

    private getTrinketRarityProbability(type: NodeType): TrinketRarityEnum {
        switch (type) {
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
        clientId: string,
        potionChance: number,
        shouldGeneratePotion: boolean,
    ): Promise<void> {
        if (potionChance > 0 && potionChance < 100) {
            const newPotionChance = shouldGeneratePotion
                ? Math.min(100, potionChance - 10)
                : Math.max(0, potionChance + 10);

            await this.expeditionService.updateByFilter(
                { clientId: clientId },
                {
                    ['actConfig.potionChance']: newPotionChance,
                },
            );
        }
    }

    // Methods below migrated from ExpeditionService to avoid circular dependencies
    public isCurrentCombatEnded(ctx: GameContext): boolean {
        return (
            this.playerService.isDead(ctx) || this.enemyService.isAllDead(ctx)
        );
    }

    public isEntityDead(ctx: GameContext, target: ExpeditionEntity): boolean {
        if (PlayerService.isPlayer(target)) {
            return this.playerService.isDead(ctx);
        } else if (EnemyService.isEnemy(target)) {
            return this.enemyService.isDead(target);
        }
    }

    /**
     * Get entities based on the type and the context
     *
     * @param ctx Context
     * @param type Type of the entity
     * @param source Source of the action
     * @param [selectedEnemy] Preselected enemy
     *
     * @returns Array of expedition entities
     *
     * @throws Error if the type is not found
     */
    public getEntitiesByType(
        ctx: GameContext,
        type: CardTargetedEnum,
        source: ExpeditionEntity,
        selectedEnemy: EnemyId,
    ): ExpeditionEntity[] {
        const targets: ExpeditionEntity[] = [];

        switch (type) {
            case CardTargetedEnum.Player:
                targets.push(this.playerService.get(ctx));
                break;
            case CardTargetedEnum.Self:
                targets.push(source);
                break;
            case CardTargetedEnum.AllEnemies:
                targets.push(...this.enemyService.getLiving(ctx));
                break;
            case CardTargetedEnum.RandomEnemy:
                targets.push({
                    type: CardTargetedEnum.Enemy,
                    value: this.enemyService.getRandom(ctx).value,
                });
                break;
            case CardTargetedEnum.Enemy:
                targets.push(this.enemyService.get(ctx, selectedEnemy));
                break;
        }

        if (!targets) throw new Error(`Target ${type} not found`);

        return targets;
    }
}
