import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { chain, compact, filter, find, includes, isEmpty, map, pick, remove } from 'lodash';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { CardDescriptionFormatter } from '../cardDescriptionFormatter/cardDescriptionFormatter';
import { CardRarityEnum, CardTypeEnum } from '../components/card/card.enum';
import { CardService } from '../components/card/card.service';
import { IExpeditionNodeReward } from '../components/expedition/expedition.enum';
import {
    CardPreview,
    CardReward,
    PotionReward,
    Reward,
    TrinketReward,
} from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { Node } from '../components/expedition/node';
import { NodeType } from '../components/expedition/node-type';
import { GameContext } from '../components/interfaces';
import { PotionRarityEnum } from '../components/potion/potion.enum';
import { PotionService } from '../components/potion/potion.service';
import { TrinketRarityEnum } from '../components/trinket/trinket.enum';
import { Trinket } from '../components/trinket/trinket.schema';
import { TrinketService } from '../components/trinket/trinket.service';
import { Chest } from '../components/chest/chest.schema';
import { getRandomBetween } from '../../utils';

@Injectable()
export class RewardService {
    constructor(
        private readonly cardService: CardService,
        private readonly potionService: PotionService,
        private readonly trinketService: TrinketService,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
    ) {}

    async generateRewards({
        ctx,
        cardsToGenerate,
        potionsToGenerate,
        trinketsToGenerate,
        coinsToGenerate,
        node,
        chest = null,
    }: {
        ctx: GameContext | null;
        node: Node;
        coinsToGenerate: number;
        cardsToGenerate: CardRarityEnum[];
        potionsToGenerate: PotionRarityEnum[];
        trinketsToGenerate: TrinketRarityEnum[];
        chest?: Chest;
    }): Promise<Reward[]> {
        const rewards: Reward[] = [];

        if (coinsToGenerate > 0) {
            rewards.push({
                id: randomUUID(),
                type: IExpeditionNodeReward.Gold,
                amount: coinsToGenerate,
                taken: false,
            });
        }

        if (cardsToGenerate.length > 0) {
            const cards = await this.generateCards(cardsToGenerate, node);
            // Only if we get cards for the rewards
            if (cards.length > 0) rewards.push(...cards);
        }

        if (potionsToGenerate.length > 0) {
            const potions = await this.generatePotions(potionsToGenerate);

            // Only if we get potions for the rewards
            if (potions.length > 0) rewards.push(...potions);
        }

        if (trinketsToGenerate.length > 0) {
            const trinkets = await this.generateTrinkets(
                ctx,
                trinketsToGenerate,
            );

            // Only if we get trinkets for the rewards
            if (trinkets.length > 0) rewards.push(...trinkets);
        }

        if (chest && rewards.length === 0) {
            rewards.push({
                id: randomUUID(),
                type: IExpeditionNodeReward.Gold,
                amount: getRandomBetween(chest.minCoins, chest.maxCoins), // see https://robotseamonster.monday.com/boards/2075844718/views/90131469/pulses/3979452615
                taken: false,
            });
        }

        return rewards;
    }

    async takeReward(ctx: GameContext, rewardId: string): Promise<Reward[]> {
        // Get the updated expedition
        const expedition = ctx.expedition;

        const {
            currentNode: { completed: nodeIsCompleted, nodeType },
        } = expedition;

        const expeditionId = expedition._id.toString();

        let rewards: Reward[] = [];

        rewards =
            nodeType === NodeType.Treasure
                ? expedition.currentNode.treasureData.rewards
                : expedition.currentNode.data.rewards;

        if (nodeIsCompleted) {
            // Check if the node is completed
            throw new CustomException(
                'Node already completed, cannot select reward',
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        // check if the reward that we are receiving is correct and exists
        const reward = find(rewards, { id: rewardId });

        // If the reward is invalid we throw and exception
        if (!reward) throw new Error(`Reward ${rewardId} not found`);

        // If the reward is already taken, we throw an exception
        if (reward.taken) throw new Error(`Reward ${rewardId} already claimed`);

        // Now we set that we took the reward
        reward.taken = true;

        // Now we apply the redward to the user profile
        switch (reward.type) {
            case IExpeditionNodeReward.Gold:
                await this.expeditionService.updateById(expeditionId, {
                    $inc: {
                        'playerState.gold': reward.amount,
                    },
                });
                break;
            case IExpeditionNodeReward.Potion:
                reward.taken = await this.potionService.add(
                    ctx,
                    reward.potion.potionId,
                );
                break;
            case IExpeditionNodeReward.Card:
                await this.cardService.addCardToDeck(ctx, reward.card.cardId);
                // Disable all other card rewards
                rewards = rewards.map((reward) => {
                    if (reward.type === IExpeditionNodeReward.Card) {
                        reward.taken = true;
                    }
                    return reward;
                });
                break;
            case IExpeditionNodeReward.Trinket:
                reward.taken = await this.trinketService.add(
                    ctx,
                    reward.trinket.trinketId,
                );
                break;
        }

        // Next we save the reward on the expedition
        const rewardPath =
            nodeType === NodeType.Treasure ? 'treasureData' : 'data';

        await this.expeditionService.updateById(expedition._id.toString(), {
            $set: {
                [`currentNode.${rewardPath}.rewards`]: rewards,
            },
        });

        // Now we get the rewards that are pending to be taken
        const pendingRewards = filter(rewards, {
            taken: false,
        });

        return pendingRewards;
    }

    private async generateCards(
        cardsToGenerate: CardRarityEnum[],
        node: Node,
    ): Promise<CardReward[]> {
        const cardRewards: CardReward[] = [];
        let tryAgainIfUndef = true;

        // First we create a loop for 3 cards
        for (let i = 0; i < cardsToGenerate.length; i++) {
            // Here we get all the card ids that we have as reward to
            // Avoid repetition
            const cardIds = cardRewards.map((reward) => reward.card.cardId);

            // Now we query a random card that is not in the
            // card rewards array already
            const card = await this.cardService.getRandomCard({
                isActive: true,
                rarity: cardsToGenerate[i],
                cardType: { $nin: [CardTypeEnum.Curse, CardTypeEnum.Status] },
                cardId: { $nin: cardIds },
                isUpgraded: node.act > 1,
            });

            if (card) {
                const cardFormattedDescription = CardDescriptionFormatter.process(card);
                this.cardService.addStatusDescriptions(card);

                const cardPreview = {
                    description: cardFormattedDescription,
                    ...pick(card, [
                        'cardId',
                        'name',
                        'energy',
                        'rarity',
                        'cardType',
                        'pool',
                        'isUpgraded',
                        'properties',
                    ])
                } as unknown as CardPreview;
    
                cardRewards.push({
                    id: randomUUID(),
                    type: IExpeditionNodeReward.Card,
                    card: cardPreview,
                    taken: false,
                });

                tryAgainIfUndef = true;
            } else {
                if (tryAgainIfUndef) i--;
                tryAgainIfUndef = false;
            }
        }

        return cardRewards;
    }

    private async generatePotions(
        potionsToGenerate: PotionRarityEnum[],
    ): Promise<PotionReward[]> {
        const potionRewards: PotionReward[] = [];

        for (let i = 0; i < potionsToGenerate.length; i++) {
            const potion = await this.potionService.getRandomPotion({
                isActive: true,
                rarity: potionsToGenerate[i],
            });

            if (potion)
                potionRewards.push({
                    id: randomUUID(),
                    type: IExpeditionNodeReward.Potion,
                    taken: false,
                    potion: pick(potion, ['potionId', 'name', 'description']),
                });
        }

        return potionRewards;
    }

    async liveUpdateRewards(
        ctx: GameContext,
        rewards: Reward[],
    ): Promise<Reward[]> {
        // let's start with trinkets
        const trinketRewards: TrinketReward[] = remove(
            rewards,
            ({ type }) => type == IExpeditionNodeReward.Trinket,
        ).map<TrinketReward>((reward) => <TrinketReward>reward);

        if (!isEmpty(trinketRewards))
            rewards.push(...(await this.replaceOwnedTrinkets(ctx, trinketRewards) ?? []));

        // here's where we could get funky with potions

        return rewards;
    }

    async replaceOwnedTrinkets(
        ctx: GameContext,
        trinkets: TrinketReward[],
    ): Promise<TrinketReward[]> {
        const trinketsInInventory = map<Trinket>(
            ctx.expedition.playerState.trinkets,
            'trinketId',
        );

        const dupeTrinketRarities = 
            compact(
                remove(
                    trinkets,
                    ({ trinket: { trinketId } }) =>
                        includes(trinketsInInventory, trinketId),
                ).map(
                    ({ trinket: { trinketId } }) =>
                        this.trinketService.findOne({ trinketId }).rarity
                )
            );
            

        for await (const rarity of dupeTrinketRarities) {
            trinkets.push(...(await this.generateTrinkets(ctx, [rarity]) ?? []));
        }

        return trinkets;
    }

    private async generateTrinkets(
        ctx: GameContext | null,
        trinketsToGenerate: TrinketRarityEnum[],
    ): Promise<TrinketReward[]> {
        if (trinketsToGenerate.length === 0) return [];

        const trinketsInInventory =
            ctx === null
                ? []
                : map<Trinket>(
                      ctx.expedition.playerState.trinkets,
                      'trinketId',
                  );

        return chain(this.trinketService.findAll())
            .shuffle()
            .uniqBy('rarity')
            .reject(({ trinketId }) => includes(trinketsInInventory, trinketId))
            .filter(({ rarity }) => includes(trinketsToGenerate, rarity))
            .filter(({ rarity }) => rarity !== TrinketRarityEnum.Special)
            .map<TrinketReward>((trinket) => ({
                id: randomUUID(),
                type: IExpeditionNodeReward.Trinket,
                taken: false,
                trinket: pick(trinket, ['trinketId', 'name', 'description']),
            }))
            .value();
    }
}
