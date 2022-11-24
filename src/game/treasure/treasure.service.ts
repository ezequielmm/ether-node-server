import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { getRandomBetween } from 'src/utils';
import { ChestService } from '../components/chest/chest.service';
import { IExpeditionNodeReward } from '../components/expedition/expedition.enum';
import { Reward } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { TreasureInterface } from './treasure.interfaces';

@Injectable()
export class TreasureService {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly chestService: ChestService,
    ) {}

    async generateTreasure(): Promise<TreasureInterface> {
        const chest = await this.chestService.getRandomChest();

        const rewards: Reward[] = [];

        const randomCoinChance = getRandomBetween(1, 100);

        if (randomCoinChance <= chest.coinChance) {
            const coin = getRandomBetween(chest.minCoins, chest.maxCoins);

            rewards.push({
                id: randomUUID(),
                type: IExpeditionNodeReward.Gold,
                amount: coin,
                taken: false,
            });
        }

        return {
            name: chest.name,
            size: chest.size,
            isOpen: false,
            rewards,
        };
    }

    async openChest(client: Socket): Promise<void> {
        await this.expeditionService.updateByFilter(
            {
                clientId: client.id,
            },
            {
                $set: {
                    'currentNode.treasureData.isOpen': true,
                },
            },
        );
    }
}
