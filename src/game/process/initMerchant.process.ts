import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';

@Injectable()
export class InitMerchantProcess {
    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async process(client: Socket, node: IExpeditionNode): Promise<string> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                node,
                client.id,
            );

        await this.expeditionService.update(client.id, {
            currentNode,
        });

        return StandardResponse.respond({
            message_type: SWARMessageType.MerchantUpdate,
            action: SWARAction.BeginMerchant,
            data: null,
        });
    }
}
