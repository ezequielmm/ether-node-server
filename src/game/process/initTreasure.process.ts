import { Injectable } from '@nestjs/common';
import { NodeStatus } from '../components/expedition/node-status';
import { Node } from '../components/expedition/node';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';

@Injectable()
export class InitTreasureProcess {
    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly expeditionService: ExpeditionService,
    ) {}

    private clientId: string;
    private node: Node;

    async process(
        ctx: GameContext,
        node: Node,
        continueTreasure = false,
    ): Promise<string> {
        this.clientId = ctx.client.id;
        this.node = node;

        if (continueTreasure) {
            return await this.continueTreasure();
        } else {
            return await this.createTreasureData(ctx);
        }
    }

    private async createTreasureData(ctx: GameContext): Promise<string> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                ctx,
                this.node,
            );

        await this.expeditionService.update(this.clientId, {
            currentNode,
        });

        return StandardResponse.respond({
            message_type: SWARMessageType.TreasureUpdate,
            action: SWARAction.BeginTreasure,
            data: null,
        });
    }

    private async continueTreasure(): Promise<string> {
        const {
            treasureData: { isOpen },
        } = await this.expeditionService.getCurrentNode({
            clientId: this.clientId,
        });

        if (isOpen) {
            return StandardResponse.respond({
                message_type: SWARMessageType.TreasureUpdate,
                action: SWARAction.ContinueTreasure,
                data: null,
            });
        } else {
            return StandardResponse.respond({
                message_type: SWARMessageType.TreasureUpdate,
                action: SWARAction.BeginTreasure,
                data: null,
            });
        }
    }
}
