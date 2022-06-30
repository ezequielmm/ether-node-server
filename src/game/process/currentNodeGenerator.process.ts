import { Injectable } from '@nestjs/common';
import { removeCardsFromPile } from 'src/utils';
import { EnemyService } from '../components/enemy/enemy.service';
import { EnemyId } from '../components/enemy/enemy.type';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import {
    IExpeditionCurrentNode,
    IExpeditionCurrentNodeDataEnemy,
    IExpeditionNode,
} from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { SettingsService } from '../components/settings/settings.service';

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
        const settings = await this.settingsService.getSettings();
        const handSize = settings.player.handSize;
        const cards = await this.expeditionService.getDeckCards({
            clientId: this.clientId,
        });

        const handCards = cards
            .sort(() => 0.5 - Math.random())
            .slice(0, handSize);

        const drawCards = removeCardsFromPile({
            originalPile: cards,
            cardsToRemove: handCards,
        });

        const enemies: IExpeditionCurrentNodeDataEnemy[] = await Promise.all(
            this.node.private_data.enemies.map(async (enemyId: EnemyId) => {
                const { _id, ...rest } = await this.enemyService.findById(
                    enemyId,
                );

                return {
                    id: _id.toString(),
                    defense: 0,
                    name: rest.name,
                    enemyId: rest.enemyId,
                    type: rest.type,
                    category: rest.category,
                    size: rest.size,
                    hpCurrent: rest.hpCurrent,
                    hpMax: rest.hpMax,
                };
            }),
        );

        return {
            nodeId: this.node.id,
            completed: this.node.isComplete,
            nodeType: this.node.type,
            data: {
                round: 0,
                player: {
                    energy: settings.player.energy.initial,
                    energyMax: settings.player.energy.max,
                    handSize,
                    defense: 0,
                    cards: {
                        draw: drawCards,
                        hand: handCards,
                        exhausted: [],
                        discard: [],
                    },
                },
                enemies,
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
}
