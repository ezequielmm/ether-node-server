import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { restoreMap } from '../map/app';
import { MerchantService } from '../merchant/merchant.service';
// import {
//     StandardResponse,
//     SWARAction,
//     SWARMessageType,
// } from '../standardResponse/standardResponse';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';

@Injectable()
export class InitMerchantProcess {
    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly merchantService: MerchantService,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async process(client: Socket, node: IExpeditionNode): Promise<void> {
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
        const potions = await this.merchantService.potions();
        const cards = await this.merchantService.card();
        const trinkets = await this.merchantService.trinket();

        selectedNode.setPrivate_data({
            cards,
            neutralCards: [],
            trinkets,
            potions,
        });

        await this.expeditionService.update(client.id, {
            currentNode,
            map: expeditionMap.getMap,
        });

        // client.emit(
        //     'MerchantUpdate',
        //     StandardResponse.respond({
        //         message_type: SWARMessageType.MerchantUpdate,
        //         action: SWARAction.MerchantUpdate,
        //         data: {
        //             cards,
        //             neutralCards: [],
        //             trinkets,
        //             potions,
        //         },
        //     }),
        // );
    }
}
