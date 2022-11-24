import { Injectable } from '@nestjs/common';
import { CombatService } from '../combat/combat.service';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import {
    IExpeditionCurrentNode,
    IExpeditionNode,
} from '../components/expedition/expedition.interface';
import { TreasureService } from '../treasure/treasure.service';

@Injectable()
export class CurrentNodeGeneratorProcess {
    private node: IExpeditionNode;
    private clientId: string;

    constructor(
        private readonly treasureService: TreasureService,
        private readonly combatService: CombatService,
    ) {}

    async getCurrentNodeData(
        node: IExpeditionNode,
        clientId: string,
    ): Promise<IExpeditionCurrentNode> {
        this.node = node;
        this.clientId = clientId;

        switch (this.node.type) {
            case ExpeditionMapNodeTypeEnum.Combat:
                return await this.getCombatCurrentNode();
            case ExpeditionMapNodeTypeEnum.Treasure:
                return await this.getTreasureCurrentNode();
            default:
                return this.getCurrentNode();
        }
    }

    private async getCombatCurrentNode(): Promise<IExpeditionCurrentNode> {
        return await this.combatService.generate(this.node, this.clientId);
    }

    private getCurrentNode(): IExpeditionCurrentNode {
        return {
            nodeId: this.node.id,
            completed: false,
            nodeType: this.node.type,
            showRewards: false,
        };
    }

    private async getTreasureCurrentNode(): Promise<IExpeditionCurrentNode> {
        const treasureData = await this.treasureService.generateTreasure();

        return {
            nodeId: this.node.id,
            completed: false,
            nodeType: this.node.type,
            showRewards: false,
            treasureData,
        };
    }
}
