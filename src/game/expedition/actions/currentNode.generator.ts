import { Injectable } from '@nestjs/common';
import { CardService } from 'src/game/components/card/card.service';
import { SettingsService } from 'src/game/settings/settings.service';
import { ExpeditionMapNodeTypeEnum } from '../enums';
import { ExpeditionService } from '../expedition.service';
import { IExpeditionCurrentNode, IExpeditionNode } from '../interfaces';

@Injectable()
export class CurrentNodeGenerator {
    private node: IExpeditionNode;
    private clientId: string;

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly cardService: CardService,
        private readonly settingsService: SettingsService,
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
        const cards = await this.expeditionService.getDeckCards(this.clientId);

        const handCards = cards.sort(() => 0.5 - Math.random()).slice(0, 5);

        const drawCards = this.cardService.removeHandCardsFromDrawPile(
            cards,
            handCards,
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
                    hand_size: 5,
                    cards: {
                        draw: drawCards,
                        hand: handCards,
                    },
                },
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
