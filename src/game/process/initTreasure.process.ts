import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { restoreMap } from '../map/app';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
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

    async process(client: Socket, node: IExpeditionNode) {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                node,
                client.id,
            );

        const map = await this.expeditionService.getExpeditionMap({
            clientId: client.id,
        });
        const expeditionMap = restoreMap(map);

        const selectedNode = expeditionMap.fullCurrentMap.get(
            currentNode.nodeId,
        );
        const treasure = this.treasureService.generateTreasure();

        selectedNode.setPrivate_data({ treasure });

        await this.expeditionService.update(client.id, {
            currentNode,
            map: expeditionMap.getMap,
        });

        client.emit(
            'TreasureNodeUpdate',
            StandardResponse.respond({
                message_type: SWARMessageType.TreasureNodeUpdate,
                action: SWARAction.TreasureNodeUpdate,
                data: treasure,
            }),
        );
        return { treasure };
    }
}
