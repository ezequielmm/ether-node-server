import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { filter, reduce } from 'lodash';
import { CardRarityEnum } from '../components/card/card.enum';
import {
    IExpeditionPlayerStateDeckCard,
    PotionInstance,
} from '../components/expedition/expedition.interface';
import { Expedition } from '../components/expedition/expedition.schema';
import { Node } from '../components/expedition/node';
import { NodeStatus } from '../components/expedition/node-status';
import { Trinket } from '../components/trinket/trinket.schema';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { Gear } from '../components/gear/gear.schema';
import { InjectModel } from 'kindagoose';
import { MapType } from '../components/expedition/map.schema';
import { Ref, ReturnModelType } from '@typegoose/typegoose';
import { VictoryItem } from 'src/squires-api/squires.types';

export interface ScoreResponse {
    outcome: string;
    expeditionType: string;
    totalScore: number;
    achievements: {
        name: string;
        score: number;
    }[];
    notifyNoLoot: boolean;
    lootbox?: Gear[];
    rewards?: {name:string, image:string}[];
    victoryItems: VictoryItem[];
}

@Injectable()
export class ScoreCalculatorService {

    @InjectModel(MapType)
    private readonly mapModel: ReturnModelType<typeof MapType>

    @Inject(forwardRef(() => Expedition))
    private readonly expedition: ReturnModelType<typeof Expedition>

    private readonly stageMultiplier: Map<number, number> = new Map([
        [1, 1],
        [2, 1.5]
    ]);

    async calculate({ expedition }: { expedition: Expedition }): Promise<ScoreResponse> {
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
            currentStage
        } = expedition;

        const totalBasicEnemies = this.calculateBasicEnemiesPoints(basicEnemiesDefeated);
        const totalEliteEnemies = this.calculateEliteEnemiesPoints(eliteEnemiesDefeated);
        const totalBossEnemies = this.calculateBossEnemyPotions(bossEnemiesDefeated);

        // Now we query how many nodes we completed in the expedition
        const refVariable: Ref<MapType> = map; 
        const refString: string = refVariable.toString();
        const mapsArray = await this.getNodesByExpeditionMap(refString);
        const nodesCompleted = await this.calculateNodesCompleted(mapsArray)//(map);

        // How we query how much HP the player got
        const healthReamining = this.calculateHP(hpCurrent, hpMax);

        // Now we query how may cards we had in our deck at the end
        const {
            deckSizePoints,
            upgradedCards,
            epicPlusCards,
            deckSizeAchievement,
        } = this.calculatePlayerDeck(playerDeck);

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

        const stageMultiplier = this.stageMultiplier.get(currentStage)

        const data: ScoreResponse = {
            outcome: status,
            expeditionType: 'Casual',
            totalScore: 0,
            achievements: [],
            notifyNoLoot: false,
            victoryItems: []
        };

        if (totalBasicEnemies > 0) {}
            data.achievements.push({
                name: 'Monsters slain',
                score: Math.floor(totalBasicEnemies * stageMultiplier),
            });

        if (totalEliteEnemies > 0)
            data.achievements.push({
                name: 'Elites defeated',
                score: Math.floor(totalEliteEnemies * stageMultiplier),
            });

        if (totalBossEnemies > 0)
            data.achievements.push({
                name: 'Bosses defeated',
                score: Math.floor(totalBossEnemies * stageMultiplier),
            });

        if (nodesCompleted > 0)
            data.achievements.push({
                name: 'Regions explored',
                score: Math.floor(nodesCompleted * stageMultiplier),
            });

        if (healthReamining > 0)
            data.achievements.push({
                name: 'Healthy',
                score: Math.floor(healthReamining * stageMultiplier),
            });

        if (deckSizePoints > 0) 
            data.achievements.push({
                name: deckSizeAchievement,
                score: Math.floor(deckSizePoints * stageMultiplier),
            });
        
        if (upgradedCards > 0)
            data.achievements.push({
                name: 'Such Upgrade, Much Wow',
                score: Math.floor(upgradedCards * stageMultiplier),
            });

        if (potionsRemaining > 0)
            data.achievements.push({
                name: 'Save for Later',
                score: Math.floor(potionsRemaining * stageMultiplier),
            });

        if (trinketsRemaining > 0)
            data.achievements.push({
                name: 'Trinket Hoarder',
                score: Math.floor(trinketsRemaining * stageMultiplier),
            });

        if (speedRun > 0)
            data.achievements.push({
                name: 'Speed Run',
                score: Math.floor(speedRun * stageMultiplier),
            });
        
        if (totalCoins > 0)
            data.achievements.push({
                name: 'Scrooge',
                score: Math.floor(totalCoins * stageMultiplier),
            });

        if (epicPlusCards == 25)
            data.achievements.push({
                name: 'Pauper',
                score: Math.floor(25 * stageMultiplier),
            });

        if (epicPlusCards == 10)
            data.achievements.push({
                name: 'Prince',
                score: Math.floor(10 * stageMultiplier),
            });

        // Now we sum all the points to get the total and multiply with the stage modifier.
        data.totalScore = reduce(data.achievements, (totalScore, item) => totalScore += item.score, 0);

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

    private async calculateNodesCompleted(map: Node[]): Promise<number> {
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
        // 26 HP = 1 Point
        // 27 HP = 2 Points
        // 28 HP = 3 Points
        // ...
        // if the player has full HP it will sum 15 points
        let score = Math.max(0, hpCurrent - 25);
        if (hpCurrent === hpMax) score += 15;
        return score;
    }

    private calculatePlayerDeck(cards: IExpeditionPlayerStateDeckCard[]): {
        deckSizePoints: number;
        upgradedCards: number;
        epicPlusCards: number;
        deckSizeAchievement: string;
    } {
        // Here we calculate how many cards we have in the player's deck at the end
        // of the expedition
        // 20 cards or less = 40 points
        // 35 cards or more = 20 points
        // 45 cards or more = 50 points (overrides Librarian)
        const deckSize = cards.length;
        let deckSizePoints = 0;
        let deckSizeAchievement = '';
        if (deckSize < 20) {
            deckSizePoints = 40; // Lean and Mean
            deckSizeAchievement = 'Lean and Mean';
        }
        if (deckSize > 35) {
            deckSizePoints = 20; // Librarian
            deckSizeAchievement = 'Librarian';
        }
        if (deckSize > 45) {
            deckSizePoints = 50; // Encyclopedia
            deckSizeAchievement = 'Encyclopedia';
        }

        const upgradedCards =
            filter(cards, (card) => card.isUpgraded).length * 5;

        const epicPlusCount = filter(
            cards,
            (card) => card.rarity == CardRarityEnum.Legendary,
        ).length;
        let epicPlusCards = 0;
        if (epicPlusCount == 0) epicPlusCards = 25;
        if (epicPlusCount > 10) epicPlusCards = 10;

        return {
            deckSizePoints,
            upgradedCards,
            epicPlusCards,
            deckSizeAchievement,
        };
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

    /*
    public async getNodesByExpeditionMap(mapRefId: string): Promise<Node[]> {
        try {
            // Busca el documento en la colección "maps" utilizando el valor de mapRefId
            const map = await this.mapModel.findOne({ mapRefId });
    
            // Si no se encuentra el mapa, retorna un array vacío
            if (!map) {
                return [];
            }
    
            // Retorna el array de nodos almacenados en el campo map del mapa encontrado
            return map.map;
        } catch (error) {
            // Manejar errores de consulta aquí
            throw new Error('Error retrieving nodes: ' + error.message);
        }
    }
    */

    /*
    public async getNodesByExpeditionMap(expeditionMapId: string): Promise<Node[]> {
        try {
            // Busca la expedición por su _id utilizando el argumento expeditionMapId
            const expedition = await this.expedition.findOne({
                map: expeditionMapId,
            });
    
            // Si no se encuentra la expedición o si el campo map no está definido, retorna un array vacío
            if (!expedition || !expedition.map) {
                return [];
            }
    
            // Obtiene el valor del campo map en la expedición, que es un ObjectId
            const mapRefId = expedition.map;
    
            // Busca todos los documentos en la colección "maps" que tienen el mismo valor en el campo "mapRefId"
            const maps = await this.mapModel.find({ mapRefId });
    
            // Crea un array para almacenar todos los nodos de los mapas encontrados
            let allNodes: Node[] = [];
    
            // Itera sobre los mapas encontrados y agrega los nodos al array allNodes
            maps.forEach((map) => {
                allNodes = allNodes.concat(map.map);
            });
    
            // Retorna el array de todos los nodos de los mapas encontrados
            return allNodes;
        } catch (error) {
            // Manejar errores de consulta aquí
            throw new Error('Error retrieving nodes: ' + error.message);
        }
    }
    */

    public async getNodesByExpeditionMap(mapField: string): Promise<Node[]> {
        try {
            // Busca todos los documentos en la colección "maps" que tienen el mismo valor en el campo "mapRefId"
            const maps = await this.mapModel.find({ _id: mapField });
    
            // Crea un array para almacenar todos los nodos de los mapas encontrados
            let allNodes: Node[] = [];
    
            // Itera sobre los mapas encontrados y agrega los nodos al array allNodes
            maps.forEach((map) => {
                allNodes = allNodes.concat(map.map);
            });
    
            // Retorna el array de todos los nodos de los mapas encontrados
            return allNodes;
        } catch (error) {
            // Manejar errores de consulta aquí
            throw new Error('Error retrieving nodes: ' + error.message);
        }
    }
    
}
