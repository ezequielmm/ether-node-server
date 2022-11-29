import { Injectable } from '@nestjs/common';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import { Reward } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';

@Injectable()
export class GetRewardsAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<Reward[]> {
        const currentNode = await this.expeditionService.getCurrentNode({
            clientId,
        });

        switch (currentNode.nodeType) {
            case ExpeditionMapNodeTypeEnum.Combat:
                return currentNode.data.rewards;
            case ExpeditionMapNodeTypeEnum.Treasure:
                return currentNode.treasureData.rewards;
            default:
                return [];
        }
    }
}
