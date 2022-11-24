import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ExpeditionMapNodeStatusEnum } from '../components/expedition/expedition.enum';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { restoreMap } from '../map/app';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
import { TreasureService } from '../treasure/treasure.service';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';

@Injectable()
export class InitTreasureProcess {
    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly treasureService: TreasureService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    private client: Socket;
    private clientId: string;
    private node: IExpeditionNode;

    async process(client: Socket, node: IExpeditionNode): Promise<string> {
        this.client = client;
        this.clientId = client.id;
        this.node = node;

        switch (node.status) {
            case ExpeditionMapNodeStatusEnum.Available:
                return this.createTreasureData();
            case ExpeditionMapNodeStatusEnum.Active:
                return this.continueTreasure();
        }
    }

    private async createTreasureData(): Promise<string> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                this.node,
                this.clientId,
            );

        const map = await this.expeditionService.getExpeditionMap({
            clientId: this.clientId,
        });

        const expeditionMap = restoreMap(map);

        const selectedNode = expeditionMap.fullCurrentMap.get(
            currentNode.nodeId,
        );

        const treasure = this.treasureService.generateTreasure();

        selectedNode.setPrivate_data({ treasure });

        await this.expeditionService.update(this.clientId, {
            currentNode,
            map: expeditionMap.getMap,
        });

        return StandardResponse.respond({
            message_type: SWARMessageType.TreasureUpdate,
            action: SWARAction.BeginTreasure,
            data: null,
        });
    }

    private continueTreasure(): string {
        return StandardResponse.respond({
            message_type: SWARMessageType.TreasureUpdate,
            action: SWARAction.ContinueTreasure,
            data: null,
        });
    }
}
