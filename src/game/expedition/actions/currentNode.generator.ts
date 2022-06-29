import { Injectable } from '@nestjs/common';
import { CardService } from 'src/game/components/card/card.service';
import { SettingsService } from 'src/game/components/settings/settings.service';
import { ExpeditionMapNodeTypeEnum } from '../enums';
import { ExpeditionService } from '../../components/expedition/expedition.service';
import { IExpeditionCurrentNode, IExpeditionNode } from '../interfaces';
import { EnemyService } from 'src/game/components/enemy/enemy.service';

@Injectable()
export class CurrentNodeGenerator {
    private node: IExpeditionNode;
    private clientId: string;

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
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
        const cards = await this.expeditionService.getDeckCards(this.clientId);

        const handCards = cards
            .sort(() => 0.5 - Math.random())
            .slice(0, handSize);

        const drawCards = this.cardService.removeHandCardsFromDrawPile(
            cards,
            handCards,
        );

        const enemies = await Promise.all(
            this.node.private_data.enemies.map(async (enemyId) => {
                const { _id, ...rest } = await this.enemyService.findByCustomId(
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
                    hpMin: rest.hpMin,
                    hpMax: rest.hpMax,
                };
            }),
        );

        return {
            node_id: this.node.id,
            completed: this.node.isComplete,
            node_type: this.node.type,
            data: {
                round: 0,
                action: 0,
                player: {
                    energy: settings.player.energy.initial,
                    energy_max: settings.player.energy.max,
                    hand_size: handSize,
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
            node_id: this.node.id,
            completed: true,
            node_type: this.node.type,
        };
    }
}
