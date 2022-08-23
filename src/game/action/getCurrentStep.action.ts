import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';

interface CurrentStepResponse {
    act: number;
    step: number;
}

@Injectable()
export class GetCurrentStepAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<CurrentStepResponse> {
        // First we query the current node to get its id
        const { nodeId } = await this.expeditionService.getCurrentNode({
            clientId,
        });

        // Now we query the node infformation
        const { act, step } = await this.expeditionService.getExpeditionMapNode(
            {
                clientId,
                nodeId,
            },
        );

        return { act, step };
    }
}
