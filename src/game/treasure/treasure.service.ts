import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { getRandomBetween, getRandomItemByWeight } from 'src/utils';
import { ChestSizeEnum } from '../components/chest/chest.enum';
import { Chest } from '../components/chest/chest.schema';
import { ChestService } from '../components/chest/chest.service';
import { Node } from '../components/expedition/node';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { GameContext } from '../components/interfaces';
import { PotionRarityEnum } from '../components/potion/potion.enum';
import { TrinketRarityEnum } from '../components/trinket/trinket.enum';
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

    private chest: Chest;

    async generateTreasure(
        ctx: GameContext,
        node: Node,
    ): Promise<TreasureInterface> {
        const chest = await this.chestService.getRandomChest();

        this.chest = chest;

        const randomCoinChance = getRandomBetween(1, 100);
        const randomPotionChance = getRandomBetween(1, 100);

        const rewards = await this.rewardService.generateRewards({
            ctx,
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
            trinketsToGenerate: [this.getTrinketRarityProbability()],
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

    private getTrinketRarityProbability(): TrinketRarityEnum {
        switch (this.chest.size) {
            case ChestSizeEnum.Small:
                return getRandomItemByWeight(
                    [TrinketRarityEnum.Common, TrinketRarityEnum.Uncommon],
                    [0.75, 0.25],
                );
            case ChestSizeEnum.Medium:
                return getRandomItemByWeight(
                    [
                        TrinketRarityEnum.Common,
                        TrinketRarityEnum.Uncommon,
                        TrinketRarityEnum.Rare,
                    ],
                    [0.35, 0.5, 0.15],
                );
            case ChestSizeEnum.Large:
                return getRandomItemByWeight(
                    [TrinketRarityEnum.Uncommon, TrinketRarityEnum.Rare],
                    [0.75, 0.25],
                );
        }
    }
}
