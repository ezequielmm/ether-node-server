import { Injectable } from '@nestjs/common';
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

    async process(
        ctx: GameContext,
        node: Node,
        continueTreasure = false,
    ): Promise<string> {
        return continueTreasure
            ? await this.continueTreasure(ctx)
            : await this.createTreasureData(ctx, node);
    }

    private async createTreasureData(
        ctx: GameContext,
        node: Node,
    ): Promise<string> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                ctx,
                node,
            );

        await this.expeditionService.update(ctx.client.id, {
            currentNode,
        });

        return StandardResponse.respond({
            message_type: SWARMessageType.TreasureUpdate,
            action: SWARAction.BeginTreasure,
            data: null,
        });
    }

    private async continueTreasure(ctx: GameContext): Promise<string> {
        const {
            expedition: {
                currentNode: {
                    treasureData: { isOpen },
                },
            },
        } = ctx;

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
