import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionMapNodeStatusEnum } from '../components/expedition/expedition.enum';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
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

    async process(client: Socket, node: IExpeditionNode): Promise<string> {
        this.clientId = client.id;
        this.node = node;

        switch (node.status) {
            case ExpeditionMapNodeStatusEnum.Available:
                return await this.createTreasureData();
            case ExpeditionMapNodeStatusEnum.Active:
                return await this.continueTreasure();
        }
    }

    private async createTreasureData(): Promise<string> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                this.node,
                this.clientId,
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

        return isOpen
            ? StandardResponse.respond({
                  message_type: SWARMessageType.TreasureUpdate,
                  action: SWARAction.ContinueTreasure,
                  data: null,
              })
            : StandardResponse.respond({
                  message_type: SWARMessageType.TreasureUpdate,
                  action: SWARAction.BeginTreasure,
                  data: null,
              });
    }
}
