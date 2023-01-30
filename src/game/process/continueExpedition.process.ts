import { Injectable } from '@nestjs/common';
import { NodeType } from '../components/expedition/node-type';
import { GameContext } from '../components/interfaces';
import { MapService } from '../map/map.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';

@Injectable()
export class ContinueExpeditionProcess {
    constructor(private readonly mapService: MapService) {}

    async handle(ctx: GameContext): Promise<string> {
        const map = ctx.expedition.map;

        // Now we get the node information that is active at the moment
        const node = this.mapService.findNodeById(
            ctx,
            ctx.expedition.currentNode.nodeId,
        );

        // Here we complete the node and set the next as available
        // and return the new map
        this.mapService.completeNode(ctx, node.id);
        ctx.expedition.currentNode.completed = true;

        // Now we update the expedition based on the node type
        if (node.type === NodeType.Combat) this.setupDataFromCombat(ctx);

        await ctx.expedition.save();

        // Send the final message with the map updated
        return StandardResponse.respond({
            message_type:
                node.type === NodeType.Combat
                    ? SWARMessageType.EndCombat
                    : SWARMessageType.EndNode,
            seed: ctx.expedition.mapSeedId,
            action: SWARAction.ShowMap,
            data: map,
        });
    }

    private setupDataFromCombat(ctx: GameContext): void {
        const { hpCurrent, hpMax } = ctx.expedition.currentNode.data.player;

        ctx.expedition.currentNode.completed = true;
        ctx.expedition.currentNode.showRewards = false;
        ctx.expedition.playerState.hpCurrent = hpCurrent;
        ctx.expedition.playerState.hpMax = hpMax;
    }
}
