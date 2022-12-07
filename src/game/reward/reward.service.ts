import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { getRandomBetween } from 'src/utils';
import { CardService } from '../components/card/card.service';
import {
    ExpeditionMapNodeTypeEnum,
    IExpeditionNodeReward,
} from '../components/expedition/expedition.enum';
import {
    IExpeditionNode,
    Reward,
} from '../components/expedition/expedition.interface';

@Injectable()
export class RewardService {
    constructor(private readonly cardService: CardService) {}

    private node: IExpeditionNode;

    async generateRewards(node: IExpeditionNode): Promise<Reward[]> {
        this.node = node;

        const rewards: Reward[] = [];

        // First we check if is a combat node, them we apply the conditions
        // to generate the coins
        if (node.type === ExpeditionMapNodeTypeEnum.Combat) {
            const amount = this.generateCoins();

            if (amount > 0) {
                rewards.push({
                    id: randomUUID(),
                    type: IExpeditionNodeReward.Gold,
                    amount,
                    taken: false,
                });
            }
        }

        return rewards;
    }

    private generateCoins(): number {
        switch (this.node.subType) {
            case ExpeditionMapNodeTypeEnum.CombatStandard:
                return getRandomBetween(10, 20);
            case ExpeditionMapNodeTypeEnum.CombatElite:
                return getRandomBetween(25, 35);
            case ExpeditionMapNodeTypeEnum.CombatBoss:
                return getRandomBetween(95, 105);
            default:
                return 0;
        }
    }
}
