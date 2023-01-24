import { Injectable } from '@nestjs/common';
import { filter } from 'lodash';
import {
    IExpeditionPlayerStateDeckCard,
    PotionInstance,
} from '../components/expedition/expedition.interface';
import { Expedition } from '../components/expedition/expedition.schema';
import { Node } from '../components/expedition/node';
import { NodeStatus } from '../components/expedition/node-status';
import { Trinket } from '../components/trinket/trinket.schema';

export interface ScoreResponse {
    outcome: string;
    totalScore: number;
    achievements: {
        name: string;
        score: number;
    }[];
}

@Injectable()
export class ScoreCalculatorService {
    calculate({
        expedition,
        outcome,
    }: {
        expedition: Expedition;
        outcome: string;
    }): ScoreResponse {
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
            },
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
        const deckSize = this.calculatePlayerDeck(playerDeck);

        // Now we query how many potions we have remaining
        const potionsRemaining = this.calculateRemainingPotions(potions);

        // Now we query how many trinkets we havce remaining
        const trinketsRemaining = this.calculateTrinkets(trinkets);

        // How we sum all the points to get the total
        const totalScore =
            totalBasicEnemies +
            totalEliteEnemies +
            totalBossEnemies +
            nodesCompleted +
            healthReamining +
            deckSize +
            potionsRemaining +
            trinketsRemaining;

        const data: ScoreResponse = {
            outcome,
            totalScore,
            achievements: [],
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
        let score = 0;
        if (hpCurrent === hpMax) score = 15;
        if (hpCurrent === 25) score = 1;
        if (hpCurrent === 26) score = 2;
        if (hpCurrent === 27) score = 3;
        return score;
    }

    private calculatePlayerDeck(
        cards: IExpeditionPlayerStateDeckCard[],
    ): number {
        const deckSize = cards.length;
        let total = 0;
        if (deckSize < 20) total = 40; // Lean and Mean
        if (deckSize > 35) total = 20; // Librarian
        if (deckSize > 45) total = 50; // Encyclopedia
        return total;
    }

    private calculateRemainingPotions(potions: PotionInstance[]): number {
        const potionsRemaining = potions.length;
        let total = 0;
        if (potionsRemaining === 1) total = 5;
        if (potionsRemaining === 2) total = 10;
        if (potionsRemaining === 3) total = 20;
        return total;
    }

    private calculateTrinkets(trinkets: Trinket[]): number {
        return trinkets.length >= 5 ? 5 : 0;
    }
}
