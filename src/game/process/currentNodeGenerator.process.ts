import { Injectable } from '@nestjs/common';
import { CombatService } from '../combat/combat.service';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import {
    IExpeditionCurrentNode,
    IExpeditionNode,
} from '../components/expedition/expedition.interface';
import { GameContext } from '../components/interfaces';
import { MerchantService } from '../merchant/merchant.service';
import { TreasureService } from '../treasure/treasure.service';
import { EncounterService } from '../components/encounter/encounter.service';

@Injectable()
export class CurrentNodeGeneratorProcess {
    private node: IExpeditionNode;

    constructor(
        private readonly treasureService: TreasureService,
        private readonly combatService: CombatService,
        private readonly merchantService: MerchantService,
        private readonly encounterService: EncounterService,
    ) {}

    async getCurrentNodeData(
        ctx: GameContext,
        node: IExpeditionNode,
    ): Promise<IExpeditionCurrentNode> {
        this.node = node;

        switch (this.node.type) {
            case ExpeditionMapNodeTypeEnum.Combat:
                return await this.getCombatCurrentNode(ctx);
            case ExpeditionMapNodeTypeEnum.Treasure:
                return await this.getTreasureCurrentNode(ctx);
            case ExpeditionMapNodeTypeEnum.Merchant:
                return await this.getMerchantCurrentNode();
            case ExpeditionMapNodeTypeEnum.Encounter:
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
