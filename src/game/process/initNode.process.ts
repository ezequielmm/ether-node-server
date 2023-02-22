import { Injectable } from '@nestjs/common';
import { Node } from '../components/expedition/node';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
import { CurrentNodeGeneratorProcess } from './currentNodeGenerator.process';

@Injectable()
export class InitNodeProcess {
    constructor(
        private readonly currentNodeGeneratorProcess: CurrentNodeGeneratorProcess,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async process(ctx: GameContext, node: Node): Promise<void> {
        const currentNode =
            await this.currentNodeGeneratorProcess.getCurrentNodeData(
                ctx,
                node,
            );

        await this.expeditionService.update(ctx.client.id, { currentNode });
    }
}
