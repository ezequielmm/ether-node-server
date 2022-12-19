import { Injectable } from '@nestjs/common';
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
export class InitMerchantProcess {
    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async process(ctx: GameContext, node: IExpeditionNode): Promise<string> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                ctx,
                node,
            );

        await this.expeditionService.update(ctx.client.id, {
            currentNode,
        });

        return StandardResponse.respond({
            message_type: SWARMessageType.MerchantUpdate,
            action: SWARAction.BeginMerchant,
            data: null,
        });
    }
}
