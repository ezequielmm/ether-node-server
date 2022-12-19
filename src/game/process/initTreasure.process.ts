import { Injectable } from '@nestjs/common';
import { ExpeditionMapNodeStatusEnum } from '../components/expedition/expedition.enum';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
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
    private node: IExpeditionNode;

    async process(ctx: GameContext, node: IExpeditionNode): Promise<string> {
        this.clientId = ctx.client.id;
        this.node = node;

        switch (node.status) {
            case ExpeditionMapNodeStatusEnum.Available:
                return await this.createTreasureData(ctx);
            case ExpeditionMapNodeStatusEnum.Active:
                return await this.continueTreasure();
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
