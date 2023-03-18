import { Injectable } from '@nestjs/common';
import { filter } from 'lodash';
import { CardRarityEnum } from '../components/card/card.enum';
import {
    IExpeditionPlayerStateDeckCard,
    PotionInstance,
} from '../components/expedition/expedition.interface';
import { Expedition } from '../components/expedition/expedition.schema';
import { Node } from '../components/expedition/node';
import { NodeStatus } from '../components/expedition/node-status';
import { Trinket } from '../components/trinket/trinket.schema';
import { Gear } from '../components/gear/gear.schema';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';

export interface ScoreResponse {
    outcome: string;
    totalScore: number;
    achievements: {
        name: string;
        score: number;
    }[];
    notifyNoLoot: boolean;
    lootbox: Gear[];
}

@Injectable()
export class ScoreCalculatorService {
    calculate({ expedition }: { expedition: Expedition }): ScoreResponse {
        // All the points will be calculatred based on
        // this documentation:
        // https://robotseamonster.atlassian.net/wiki/spaces/KOTE/pages/272334852/Requirements+for+GameEnd+Score+from+Adam
        // First we calculate the enemies defeated
        const {
            scores: {
                basicEnemiesDefeated,
                eliteEnemiesDefeated,
                bossEnemiesDefeated,
            },
            map,
            playerState: {
                hpCurrent,
                hpMax,
                cards: playerDeck,
                potions,
                trinkets,
                gold,
            },
            status,
            createdAt,
            endedAt,
            lootbox,
        } = expedition;

        const totalBasicEnemies =
            this.calculateBasicEnemiesPoints(basicEnemiesDefeated);
        const totalEliteEnemies =
            this.calculateEliteEnemiesPoints(eliteEnemiesDefeated);
        const totalBossEnemies =
            this.calculateBossEnemyPotions(bossEnemiesDefeated);

        // Now we query how many nodes we completed in the expedition
        const nodesCompleted = this.calculateNodesCompleted(map);

        // How we query how much HP the player got
        const healthReamining = this.calculateHP(hpCurrent, hpMax);

        // Now we query how may cards we had in our deck at the end
        const { deckSize, upgradedCards, epicPlusCards } =
            this.calculatePlayerDeck(playerDeck);

        // Now we query how many potions we have remaining
        const potionsRemaining = this.calculateRemainingPotions(potions);

        // Now we query how many trinkets we have so far
        const trinketsRemaining = this.calculateTrinkets(trinkets);

        // Now we query how many coins we have remaining
        const totalCoins = this.calculateCoinsRemaining(gold);

        // Now we look for points and achievements for ending within 1 hour
        const speedRun =
            status == ExpeditionStatusEnum.Victory
                ? this.calculateDuration(createdAt, endedAt)
                : 0;

        // How we sum all the points to get the total
        const totalScore =
            totalBasicEnemies +
            totalEliteEnemies +
            totalBossEnemies +
            nodesCompleted +
            healthReamining +
            deckSize +
            potionsRemaining +
            trinketsRemaining +
            totalCoins +
            upgradedCards +
            epicPlusCards +
            speedRun;

        const data: ScoreResponse = {
            outcome: status,
            totalScore,
            achievements: [],
            notifyNoLoot: false,
            lootbox,
        };

        if (totalBasicEnemies > 0)
            data.achievements.push({
                name: 'Monsters slain',
                score: totalBasicEnemies,
            });

        if (totalEliteEnemies > 0)
            data.achievements.push({
                name: 'Act I Elites defeated',
                score: totalEliteEnemies,
            });

        if (totalBossEnemies > 0)
            data.achievements.push({
                name: 'Bosses defeated',
                score: totalBossEnemies,
            });

        if (nodesCompleted > 0)
            data.achievements.push({
                name: 'Regions explored',
                score: nodesCompleted,
            });

        if (healthReamining > 0)
            data.achievements.push({
                name: 'Healthy',
                score: healthReamining,
            });

        if (speedRun > 0)
            data.achievements.push({
                name: 'Speed Run',
                score: speedRun,
            });

        if (deckSize > 0)
            data.achievements.push({
                name:
                    deckSize < 20
                        ? 'Lean and Mean'
                        : deckSize > 35
                        ? 'Librarian'
                        : deckSize > 45
                        ? 'Encyclopedia'
                        : 'Lean and Mean',
                score: deckSize,
            });

        if (potionsRemaining > 0)
            data.achievements.push({
                name: 'Save for Later',
                score: potionsRemaining,
            });

        if (trinketsRemaining > 0)
            data.achievements.push({
                name: 'Trinket Hoarder',
                score: trinketsRemaining,
            });

        if (totalCoins > 0)
            data.achievements.push({
                name: 'Scrooge',
                score: totalCoins,
            });

        if (epicPlusCards == 25)
            data.achievements.push({
                name: 'Pauper',
                score: 25,
            });

        if (epicPlusCards == 10)
            data.achievements.push({
                name: 'Prince',
                score: 10,
            });

        return data;
    }

    private calculateBasicEnemiesPoints(enemiesToCalculate: number): number {
        // This method will calculate how many basic enemies
        // we defeated during the whole expedition
        // 1 basic enemy = 2 points
        return enemiesToCalculate * 2;
    }

    private calculateEliteEnemiesPoints(enemiesToCalculate: number): number {
        // This method will calculate how many elite enemies
        // we defeated during the whole expedition
        // 1 elite enemy = 10 points
        return enemiesToCalculate * 10;
    }

    private calculateBossEnemyPotions(enemiesToCalculate: number): number {
        // This method will calculate how many elite enemies
        // we defeated during the whole expedition
        // 1 boss enemy = 100 points
        return enemiesToCalculate * 100;
    }

    private calculateNodesCompleted(map: Node[]): number {
        // here we calculate how many completed nodes we got
        // in this expedition
        // 1 node completed = 5 points
        const nodesCompleted = filter(map, {
            status: NodeStatus.Completed,
        }).length;

        return nodesCompleted * 5;
    }

    private calculateHP(hpCurrent: number, hpMax: number): number {
        // Here we calculate how many points the player will
        // get based on how much HP remanining it got when the calculation is
        // made
        // 25 HP = 1 Point
        // 26 HP = 2 Points
        // 27 HP = 3 Points
        // if the player has full HP it will sum 15 points
        let score = Math.max(0, hpCurrent - 24);
        if (hpCurrent === hpMax) score += 15;
        return score;
    }

    private calculatePlayerDeck(cards: IExpeditionPlayerStateDeckCard[]): {
        [key: string]: any;
    } {
        // Here we calculate how many cards we have in the player's deck at the end
        // of the expedition
        // 20 cards or less = 40 points
        // 35 cards or more = 20 points
        // 45 cards or more = 50 points (overrides Librarian)
        const deckSize = cards.length;
        let total = 0;
        if (deckSize < 20) total = 40; // Lean and Mean
        if (deckSize > 35) total = 20; // Librarian
        if (deckSize > 45) total = 50; // Encyclopedia

        const upgradedCards =
            filter(cards, (card) => card.isUpgraded).length * 5;
        const epicPlusCount = filter(
            cards,
            (card) => card.rarity == CardRarityEnum.Legendary,
        ).length;
        let epicPlusCards = 0;
        if (epicPlusCount == 0) epicPlusCards = 25;
        if (epicPlusCount > 10) epicPlusCards = 10;

        return { total, upgradedCards, epicPlusCards };
    }

    private calculateRemainingPotions(potions: PotionInstance[]): number {
        // here we calculate hown many potions the player didn't use
        // 1 potion left = 5 points
        // 2 potions left = 10 points
        // 3 potions left = 20 points
        const potionsRemaining = potions.length;
        let total = 0;
        if (potionsRemaining === 1) total = 5;
        if (potionsRemaining === 2) total = 10;
        if (potionsRemaining === 3) total = 20;
        return total;
    }

    private calculateTrinkets(trinkets: Trinket[]): number {
        // here we calculate hown many trinkets the player have
        // if the player have 5 or more trinkets, it gets 5 points
        return trinkets.length >= 5 ? 5 : 0;
    }

    private calculateCoinsRemaining(coins: number): number {
        // Here we calculate if the player has more than 250 coins
        // at the end of the expedition
        // 250 coins or more = 15 points
        return coins > 250 ? 15 : 0;
    }

    private calculateDuration(createdAt: Date, endedAt: Date): number {
        const duration = Math.floor(
            (endedAt.getTime() - createdAt.getTime()) / 60000,
        );
        const points = Math.max(60 - duration, 0);
        return points;
    }
}
