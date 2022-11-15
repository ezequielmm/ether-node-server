import { Injectable } from '@nestjs/common';
import { ExpeditionService } from '../components/expedition/expedition.service';
@Injectable()
export class GetTreasureDataAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string) {
        const { nodeId } = await this.expeditionService.getCurrentNode({
            clientId,
        });

        const {
            private_data: { treasure },
        } = await this.expeditionService.getExpeditionMapNode({
            clientId,
            nodeId,
        });

        return treasure.type;
    }
}
