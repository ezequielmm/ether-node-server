import { Injectable } from '@nestjs/common';
import { ExpeditionMapNodeTypeEnum } from '../components/expedition/expedition.enum';
import { Reward } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';

@Injectable()
export class GetRewardsAction {
    constructor(private readonly expeditionService: ExpeditionService) {}

    async handle(clientId: string): Promise<{ rewards: Reward[] }> {
        const currentNode = await this.expeditionService.getCurrentNode({
            clientId,
        });

        let rewards = [];

        switch (currentNode.nodeType) {
            case ExpeditionMapNodeTypeEnum.Combat:
                rewards = currentNode.showRewards
                    ? currentNode.data.rewards
                    : [];
                break;
            case ExpeditionMapNodeTypeEnum.Treasure:
                rewards = currentNode.treasureData.rewards;
                break;
            default:
                rewards = [];
                break;
        }

        return { rewards };
    }
}
