import { Injectable } from '@nestjs/common';
import { CombatService } from '../combat/combat.service';
import { NodeType } from '../components/expedition/node-type';
import { IExpeditionCurrentNode } from '../components/expedition/expedition.interface';
import { Node } from '../components/expedition/node';
import { GameContext } from '../components/interfaces';
import { MerchantService } from '../merchant/merchant.service';
import { TreasureService } from '../treasure/treasure.service';
import { EncounterService } from '../components/encounter/encounter.service';
import { isEmpty } from 'lodash';

@Injectable()
export class CurrentNodeGeneratorProcess {
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
        switch (node.type) {
            case NodeType.Combat:
                return await this.getCombatCurrentNode(ctx, node);
            case NodeType.Treasure:
                return await this.getTreasureCurrentNode(ctx, node);
            case NodeType.Merchant:
                return await this.getMerchantCurrentNode(ctx, node);
            case NodeType.Encounter:
                return await this.getEncounterCurrentNode(ctx, node);
            default:
                return this.getCurrentNode(node);
        }
    }

    private async getCombatCurrentNode(ctx: GameContext, node: Node): Promise<IExpeditionCurrentNode> {
        return await this.combatService.generate(ctx, node);
    }

    private async getEncounterCurrentNode(
        ctx: GameContext,
        node: Node,
    ): Promise<IExpeditionCurrentNode> {
        const encounterData = await this.encounterService.generateEncounter(
            ctx,
            node,
        );

        return {
            nodeId: node.id,
            completed: false,
            nodeType: node.type,
            showRewards: false,
            encounterData,
        };
    }

    private getCurrentNode(node: Node): IExpeditionCurrentNode {
        return {
            nodeId: node.id,
            completed: false,
            nodeType: node.type,
            showRewards: false,
        };
    }

    private async getTreasureCurrentNode(
        ctx: GameContext,
        node: Node,
    ): Promise<IExpeditionCurrentNode> {
        const treasureData = await this.treasureService.generateTreasure(
            ctx,
            node,
        );

        return {
            nodeId: node.id,
            completed: false,
            nodeType: node.type,
            showRewards: false,
            treasureData,
        };
    }

    private async getMerchantCurrentNode(
        ctx: GameContext,
        node: Node,
    ): Promise<IExpeditionCurrentNode> {
        // First we check if we have a current node, if we do, we check if we have merchant items
        // If we don't have merchant items, we generate them
        // If we do have merchant items, we return them
        const {
            expedition: { currentNode },
        } = ctx || {};

        if (isEmpty(currentNode)) {
            const merchantItems = await this.merchantService.generateMerchant(
                ctx,
                node,
            );

            return {
                nodeId: node.id,
                completed: false,
                nodeType: node.type,
                showRewards: false,
                merchantItems,
            };
        }

        let {
            expedition: {
                currentNode: { merchantItems },
            },
        } = ctx || {};

        if (isEmpty(merchantItems))
            merchantItems = await this.merchantService.generateMerchant(
                ctx,
                node,
            );

        return {
            nodeId: node.id,
            completed: false,
            nodeType: node.type,
            showRewards: false,
            merchantItems,
        };
    }
}
