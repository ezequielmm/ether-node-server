import { Injectable } from '@nestjs/common';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';

@Injectable()
export class InitNodeProcess {
    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async process(ctx: GameContext, node: IExpeditionNode): Promise<void> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                ctx,
                node,
            );

        await this.expeditionService.update(ctx.client.id, { currentNode });
    }
}
