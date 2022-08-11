import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { random } from 'lodash';
import { getRandomBetween, removeCardsFromPile } from 'src/utils';
import { EnemyService } from '../components/enemy/enemy.service';
import { EnemyId } from '../components/enemy/enemy.type';
import {
    CombatTurnEnum,
    ExpeditionMapNodeTypeEnum,
    IExpeditionNodeReward,
} from '../components/expedition/expedition.enum';
import {
    IExpeditionCurrentNode,
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionNode,
    IExpeditionReward,
} from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { SettingsService } from '../components/settings/settings.service';
import { StatusType } from '../status/interfaces';

@Injectable()
export class CurrentNodeGeneratorProcess {
    private node: IExpeditionNode;
    private clientId: string;

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly settingsService: SettingsService,
        private readonly enemyService: EnemyService,
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

        const cards = await this.expeditionService.getDeckCards({
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
        const rewards = this.getRewards();

        return {
            nodeId: this.node.id,
            completed: this.node.isComplete,
            nodeType: this.node.type,
            data: {
                round: 0,
                playing: CombatTurnEnum.Player,
                player: {
                    energy: initialEnergy,
                    energyMax: maxEnergy,
                    handSize: initialHandPileSize,
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
            completed: true,
            nodeType: this.node.type,
        };
    }

    private async getEnemies(): Promise<IExpeditionCurrentNodeDataEnemy[]> {
        return await Promise.all(
            this.node.private_data.enemies.map(async (enemyId: EnemyId) => {
                const enemy = await this.enemyService.findById(enemyId);

                const newHealth = getRandomBetween(
                    enemy.healthRange[0],
                    enemy.healthRange[1],
                );

                return {
                    id: enemy._id.toString(),
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

    private getRewards(): IExpeditionReward[] {
        const amount =
            this.node.type == ExpeditionMapNodeTypeEnum.Combat
                ? random(10, 20)
                : this.node.type == ExpeditionMapNodeTypeEnum.CombatElite
                ? random(25, 35)
                : this.node.type == ExpeditionMapNodeTypeEnum.CombatBoss
                ? random(95, 105)
                : 0;

        return [
            {
                id: randomUUID(),
                type: IExpeditionNodeReward.Gold,
                amount,
                taken: false,
            },
        ];
    }
}
