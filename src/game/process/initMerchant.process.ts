import { Injectable } from '@nestjs/common';
import { Node } from '../components/expedition/node';
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
    ) {}

    async process(ctx: GameContext, node: Node): Promise<string> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                ctx,
                node,
            );

        ctx.expedition.currentNode = currentNode;
        await ctx.expedition.save();

        return StandardResponse.respond({
            message_type: SWARMessageType.MerchantUpdate,
            action: SWARAction.BeginMerchant,
            data: null,
        });
    }
}
