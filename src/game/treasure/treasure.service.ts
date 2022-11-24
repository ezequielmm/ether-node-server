import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { pick } from 'lodash';
import { Socket } from 'socket.io';
import { getRandomBetween } from 'src/utils';
import { ChestService } from '../components/chest/chest.service';
import { IExpeditionNodeReward } from '../components/expedition/expedition.enum';
import { Reward } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PotionService } from '../components/potion/potion.service';
import { TreasureInterface } from './treasure.interfaces';

@Injectable()
export class TreasureService {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly chestService: ChestService,
        private readonly potionService: PotionService,
    ) {}

    async generateTreasure(): Promise<TreasureInterface> {
        const chest = await this.chestService.getRandomChest();

        const rewards: Reward[] = [];

        const randomCoinChance = getRandomBetween(1, 100);
        const randomPotionChance = getRandomBetween(1, 100);

        if (randomCoinChance <= chest.coinChance) {
            const coin = getRandomBetween(chest.minCoins, chest.maxCoins);

            rewards.push({
                id: randomUUID(),
                type: IExpeditionNodeReward.Gold,
                amount: coin,
                taken: false,
            });
        }

        if (randomPotionChance <= chest.potionChance) {
            const potion = await this.potionService.getRandomPotion();

            rewards.push({
                id: randomUUID(),
                type: IExpeditionNodeReward.Potion,
                taken: false,
                potion: pick(potion, ['potionId', 'name', 'description']),
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
