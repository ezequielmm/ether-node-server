import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { getRandomBetween, getRandomItemByWeight } from 'src/utils';
import { ChestService } from '../components/chest/chest.service';
import { IExpeditionNode } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PotionRarityEnum } from '../components/potion/potion.enum';
import { RewardService } from '../reward/reward.service';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../standardResponse/standardResponse';
import { TreasureTypeEnum } from './treasure.enum';
import { TreasureInterface } from './treasure.interfaces';

@Injectable()
export class TreasureService {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly chestService: ChestService,
        private readonly rewardService: RewardService,
    ) {}

    async generateTreasure(
        node: IExpeditionNode,
        clientId: string,
    ): Promise<TreasureInterface> {
        const chest = await this.chestService.getRandomChest();

        const randomCoinChance = getRandomBetween(1, 100);
        const randomPotionChance = getRandomBetween(1, 100);

        const rewards = await this.rewardService.generateRewards({
            clientId,
            node,
            coinsToGenerate:
                randomCoinChance <= chest.coinChance
                    ? getRandomBetween(chest.minCoins, chest.maxCoins)
                    : 0,
            cardsToGenerate: [],
            potionsToGenerate:
                randomPotionChance <= chest.potionChance
                    ? [this.getPotionRarityProbability()]
                    : [],
            trinketsToGenerate: [],
        });

        return {
            name: chest.name,
            size: chest.size,
            isOpen: false,
            rewards,
            type: TreasureTypeEnum.NoTrap,
        };
    }

    async openChest(client: Socket): Promise<void> {
        const currentNode = await this.expeditionService.getCurrentNode({
            clientId: client.id,
        });

        const { treasureData } = currentNode;

        if (!treasureData.isOpen) {
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

        client.emit(
            'PutData',
            StandardResponse.respond({
                message_type: SWARMessageType.GenericData,
                action: SWARAction.ChestResult,
                data: {
                    type: treasureData.type,
                    rewards: treasureData.rewards,
                },
            }),
        );
    }

    private getPotionRarityProbability(): PotionRarityEnum {
        return getRandomItemByWeight(
            [
                PotionRarityEnum.Common,
                PotionRarityEnum.Uncommon,
                PotionRarityEnum.Rare,
            ],
            [0.65, 0.25, 0.1],
        );
    }
}
