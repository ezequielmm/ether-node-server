import { Injectable } from '@nestjs/common';
import { CombatService } from '../combat/combat.service';
import { NodeType } from '../components/expedition/node-type';
import { IExpeditionCurrentNode } from '../components/expedition/expedition.interface';
import { Node } from '../components/expedition/node';
import { GameContext } from '../components/interfaces';
import { MerchantService } from '../merchant/merchant.service';
import { TreasureService } from '../treasure/treasure.service';
import { EncounterService } from '../components/encounter/encounter.service';

@Injectable()
export class CurrentNodeGeneratorProcess {
    private node: Node;

    constructor(
        private readonly treasureService: TreasureService,
        private readonly combatService: CombatService,
        private readonly merchantService: MerchantService,
        private readonly encounterService: EncounterService,
    ) {}

    async getCurrentNodeData(
        ctx: GameContext,
        node: Node,
    ): Promise<IExpeditionCurrentNode> {
        this.node = node;

        switch (this.node.type) {
            case NodeType.Combat:
                return await this.getCombatCurrentNode(ctx);
            case NodeType.Treasure:
                return await this.getTreasureCurrentNode(ctx);
            case NodeType.Merchant:
                return await this.getMerchantCurrentNode();
            case NodeType.Encounter:
                return await this.getEncounterCurrentNode();
            default:
                return this.getCurrentNode();
        }
    }

    private async getCombatCurrentNode(
        ctx: GameContext,
    ): Promise<IExpeditionCurrentNode> {
        return await this.combatService.generate(ctx, this.node);
    }

    private async getEncounterCurrentNode(): Promise<IExpeditionCurrentNode> {
        const encounterData = await this.encounterService.generateEncounter();

        return {
            nodeId: this.node.id,
            completed: false,
            nodeType: this.node.type,
            showRewards: false,
            encounterData,
        };
    }

    private getCurrentNode(): IExpeditionCurrentNode {
        return {
            nodeId: this.node.id,
            completed: false,
            nodeType: this.node.type,
            showRewards: false,
        };
    }

    private async getTreasureCurrentNode(
        ctx: GameContext,
    ): Promise<IExpeditionCurrentNode> {
        const treasureData = await this.treasureService.generateTreasure(
            ctx,
            this.node,
        );

        return {
            nodeId: this.node.id,
            completed: false,
            nodeType: this.node.type,
            showRewards: false,
            treasureData,
        };
    }

    private async getMerchantCurrentNode(): Promise<IExpeditionCurrentNode> {
        const merchantItems = await this.merchantService.generateMerchant();

        return {
            nodeId: this.node.id,
            completed: false,
            nodeType: this.node.type,
            showRewards: false,
            merchantItems,
        };
    }
}
