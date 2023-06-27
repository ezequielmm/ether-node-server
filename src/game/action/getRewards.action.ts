import { Injectable } from '@nestjs/common';
import { NodeType } from '../components/expedition/node-type';
import { Reward } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { CardDescriptionFormatter } from 'src/game/cardDescriptionFormatter/cardDescriptionFormatter';
import { IExpeditionNodeReward } from '../components/expedition/expedition.enum';
import { Card } from '../components/card/card.schema';
import { CardService } from '../components/card/card.service';

@Injectable()
export class GetRewardsAction {
    constructor(private readonly expeditionService: ExpeditionService,
                private readonly cardService: CardService) {}

    async handle(clientId: string): Promise<{ rewards: Reward[] }> {
        const currentNode = await this.expeditionService.getCurrentNode({
            clientId,
        });

        let rewards = [];

        switch (currentNode.nodeType) {
            case NodeType.Combat:
                rewards = currentNode.showRewards
                    ? await this.manageCardDescriptions(currentNode.data.rewards)
                    : [];
                break;
            case NodeType.Treasure:
                rewards = currentNode.treasureData.rewards;
                break;
            default:
                rewards = [];
                break;
        }

        return { rewards };
    }

    private async manageCardDescriptions(rewards:Reward[]):Promise<Reward[]>{
        for(let reward of rewards){
            if (reward.type === IExpeditionNodeReward.Card){
                let card:Card = await this.cardService.findById(reward.card.cardId);
                reward.card.description = CardDescriptionFormatter.process(card);
            }
        }

        return rewards;
    }
}
