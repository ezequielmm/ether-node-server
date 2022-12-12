import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
    ExpeditionMapNodeStatusEnum,
    ExpeditionMapNodeTypeEnum,
} from '../components/expedition/expedition.enum';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionDocument } from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { restoreMap } from '../map/app';
import Node from '../map/nodes/node';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';

@Injectable()
export class ContinueExpeditionProcess {
    constructor(private readonly expeditionService: ExpeditionService) {}

    private expedition: ExpeditionDocument;
    private node: IExpeditionNode;

    async handle({ client }: { client: Socket }): Promise<string> {
        // Here we get the updated expedition
        this.expedition = await this.expeditionService.findOne({
            clientId: client.id,
        });

        // Now we get the node information that is active at the moment
        this.node = this.expedition.map.find(
            (node) => node.id === this.expedition.currentNode.nodeId,
        );

        // Here we complete the node and set the next as available
        // and return the new map
        const newMap = this.completeNode();

        // Now we update the expedition based on the node type
        if (this.node.type === ExpeditionMapNodeTypeEnum.Combat) {
            await this.updateExpeditionForCombat(newMap);
        } else {
            await this.updateExpedition(newMap);
        }

        // Send the final message with the map updated
        return StandardResponse.respond({
            message_type:
                this.node.type === ExpeditionMapNodeTypeEnum.Combat
                    ? SWARMessageType.EndCombat
                    : SWARMessageType.EndNode,
            seed: this.expedition.mapSeedId,
            action: SWARAction.ShowMap,
            data: newMap,
        });
    }

    private completeNode(): Node[] {
        // This will be for now combat nodes (merchant, camp, etc)
        const { map: oldMap } = this.expedition;

        const newMap = restoreMap(oldMap);
        newMap.activeNode = newMap.fullCurrentMap.get(this.node.id);
        newMap.activeNode.complete(newMap);
        newMap.activeNode.status = ExpeditionMapNodeStatusEnum.Completed;

        return newMap.getMap;
    }

    private async updateExpedition(newMap: Node[]): Promise<void> {
        await this.expeditionService.updateById(
            this.expedition._id.toString(),
            {
                $set: {
                    map: newMap,
                    'currentNode.completed': true,
                },
            },
        );
    }

    private async updateExpeditionForCombat(newMap: Node[]): Promise<void> {
        const {
            currentNode: {
                data: {
                    player: { hpCurrent, hpMax },
                },
            },
        } = this.expedition;

        await this.expeditionService.updateById(
            this.expedition._id.toString(),
            {
                $set: {
                    map: newMap,
                    'currentNode.completed': true,
                    'currentNode.showRewards': false,
                    'playerState.hpCurrent': hpCurrent,
                    'playerState.hpMax': hpMax,
                },
            },
        );
    }
}
