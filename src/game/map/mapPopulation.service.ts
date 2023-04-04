import { Injectable } from '@nestjs/common';
import { Node } from '../components/expedition/node';
import { NodeType } from '../components/expedition/node-type';
import { CombatService } from '../combat/combat.service';
import { EncounterService } from '../components/encounter/encounter.service';
import { TreasureService } from '../treasure/treasure.service';
import { MerchantService } from '../merchant/merchant.service';

@Injectable()
export class MapPopulationService {
    constructor(
        private readonly combatService: CombatService,
        private readonly encounterService: EncounterService,
        private readonly treasureService: TreasureService,
        private readonly merchantService: MerchantService,
    ) {}

    public async populateNode(node: Node): Promise<Node> {
        switch (node.type) {
            case NodeType.Encounter:
                node.private_data =
                    await this.encounterService.getRandomEncounter();
                break;
            case NodeType.Treasure:
                node.private_data =
                    await this.treasureService.generateBaseTreasure(node);
                break;
            case NodeType.Merchant:
                node.private_data =
                    await this.merchantService.generateMerchant();
                break;
            case NodeType.Combat:
                node.private_data = await this.combatService.generateBaseState(
                    node,
                );
                break;
            default:
                node.private_data = {};
                break;
        }

        return node;
    }

    public async populateNodes(nodes: Node[]): Promise<Node[]> {
        for await (const node of nodes) {
            await this.populateNode(node);
        }

        return nodes;
    }
}
