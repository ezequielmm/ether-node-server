import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { filter } from 'lodash';
import { FilterQuery, Model } from 'mongoose';
import { CardPlayedAction } from 'src/game/action/cardPlayed.action';
import {
    EVENT_AFTER_DRAW_CARDS,
    EVENT_AFTER_STATUSES_UPDATE,
    EVENT_AFTER_STATUS_ATTACH,
    EVENT_BEFORE_PLAYER_TURN_END,
} from 'src/game/constants';
import {
    AttachedStatus,
    StatusDirection,
    StatusEffect,
    StatusMetadata,
} from 'src/game/status/interfaces';
import {
    AfterStatusAttachEvent,
    AfterStatusesUpdateEvent,
    StatusService,
} from 'src/game/status/status.service';
import { IExpeditionPlayerStateDeckCard } from '../expedition/expedition.interface';
import { ExpeditionService } from '../expedition/expedition.service';
import { GameContext } from '../interfaces';
import { PlayerService } from '../player/player.service';
import { CardKeywordEnum, CardRarityEnum, CardTypeEnum } from './card.enum';
import { Card, CardDocument } from './card.schema';
import { CardId, getCardIdField } from './card.type';
import { EffectDTO } from '../../effects/effects.interface';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { CardDescriptionFormatter } from 'src/game/cardDescriptionFormatter/cardDescriptionFormatter';
import { getRandomNumber } from 'src/utils';
import { AfterDrawCardEvent } from 'src/game/action/drawCard.action';
import { MoveCardAction } from 'src/game/action/moveCard.action';

@Injectable()
export class CardService {
    private readonly logger = new Logger(CardService.name);
    constructor(
        @InjectModel(Card.name) private readonly card: Model<CardDocument>,
        private readonly cardPlayedAction: CardPlayedAction,
        private readonly expeditionService: ExpeditionService,
        private readonly statusService: StatusService,
        private readonly playerService: PlayerService,
        private readonly moveCardAction: MoveCardAction,
    ) {}

    async findAll(): Promise<CardDocument[]> {
        return this.card.find({ isActive: true }).lean();
    }

    async find(filter?: FilterQuery<Card>): Promise<CardDocument[]> {
        return await this.card.find(filter).lean();
    }

    async findOne(filter: FilterQuery<Card>): Promise<CardDocument> {
        return await this.card.findOne(filter).lean();
    }

    async getRandomCard(
        filter?: FilterQuery<Card>,
        amount = 1,
    ): Promise<CardDocument> {
        const [card] = await this.card.aggregate<CardDocument>([
            { $match: filter },
            { $sample: { size: amount } },
        ]);

        return card;
    }

    async findByType(card_type: CardTypeEnum): Promise<CardDocument[]> {
        return this.card
            .find({
                card_type,
                isActive: true,
                cardType: { $ne: CardTypeEnum.Status },
            })
            .lean();
    }

    async findByRarity(rarity: CardRarityEnum): Promise<CardDocument[]> {
        return this.card
            .find({
                rarity,
                isActive: true,
                cardType: { $ne: CardTypeEnum.Status },
            })
            .lean();
    }

    async findById(id: CardId): Promise<CardDocument> {
        const field = getCardIdField(id);
        return this.card.findOne({ [field]: id }).lean();
    }

    async findCardsById(cards: number[]): Promise<CardDocument[]> {
        return this.card.find({ cardId: { $in: cards } }).lean();
    }

    async randomCards(
        limit: number,
        card_type: CardTypeEnum,
    ): Promise<CardDocument[]> {
        const count = await this.card.countDocuments({
            $and: [
                {
                    $or: [
                        { rarity: CardRarityEnum.Common },
                        { rarity: CardRarityEnum.Uncommon },
                        { rarity: CardRarityEnum.Rare },
                    ],
                },
                {
                    cardType: card_type,
                    isActive: true,
                },
            ],
        });

        const random = getRandomNumber(count);

        return await this.card
            .find({
                $and: [
                    {
                        $or: [
                            { rarity: CardRarityEnum.Common },
                            { rarity: CardRarityEnum.Uncommon },
                            { rarity: CardRarityEnum.Rare },
                        ],
                    },
                    {
                        cardType: card_type,
                        isActive: true,
                    },
                ],
            })
            .limit(limit)
            .skip(random);
    }

    async addCardToDeck(ctx: GameContext, cardId: number): Promise<void> {
        const newCard = await this.findById(cardId);
        const deck = ctx.expedition.playerState.cards;

        deck.push({
            id: randomUUID(),
            isTemporary: false,
            description: CardDescriptionFormatter.process(newCard),
            ...newCard,
        });

        this.logger.debug(`Adding card ${cardId} to deck`);

        await this.expeditionService.updatePlayerDeck({
            clientId: ctx.client.id,
            deck,
        });
    }

    async removeCardFromDeck(ctx: GameContext, cardId: string): Promise<void> {
        const deck = ctx.expedition.playerState.cards;

        const newDeck = filter(deck, (card) => card.id !== cardId);

        this.expeditionService.updatePlayerDeck({
            deck: newDeck,
        });
    }

    @OnEvent(EVENT_AFTER_DRAW_CARDS)
    async onAfterDrawCards(payload: AfterDrawCardEvent) {
        const { ctx, newHand } = payload;

        const cards = filter(newHand, {
            triggerOnDrawn: true,
        });

        if (cards.length) {
            for (const card of cards) {
                this.logger.debug(
                    `Auto playing card ${card.cardId}:${card.name}`,
                );
                await this.cardPlayedAction.handle({
                    client: ctx.client,
                    cardId: card.id,
                    selectedEnemyId: undefined,
                });
            }
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_END)
    async onBeforePlayerTurnEnd(payload: { ctx: GameContext }) {
        const ctx = payload.ctx as GameContext;

        const cards = filter(
            ctx.expedition.currentNode.data.player.cards.hand,
            {
                triggerAtEndOfTurn: true,
            },
        );

        if (cards.length) {
            for (const card of cards) {
                this.logger.debug(
                    `Auto playing card ${card.cardId}:${card.name}`,
                );
                await this.cardPlayedAction.handle({
                    client: ctx.client,
                    cardId: card.id,
                    selectedEnemyId: undefined,
                });
            }
        }
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_END)
    async onMoveFadeCard(payload: { ctx: GameContext }) {
        const { ctx } = payload;

        const cards = filter(
            ctx.expedition.currentNode.data.player.cards.hand,
            {
                keywords: [CardKeywordEnum.Fade],
            },
        );

        await this.moveCardAction.handle({
            client: ctx.client,
            cardIds: cards.map((card) => card.id),
            originPile: 'hand',
            targetPile: 'exhausted',
        });
    }

    @OnEvent(EVENT_AFTER_STATUS_ATTACH)
    async afterStatusAttachEvent(args: AfterStatusAttachEvent) {
        const { ctx, target, status } = args;

        if (PlayerService.isPlayer(target)) {
            await this.syncAllCardsByStatusMutated(ctx, status);
        }
    }

    @OnEvent(EVENT_AFTER_STATUSES_UPDATE)
    async afterStatusesUpdate(args: AfterStatusesUpdateEvent) {
        const { ctx, target, collection } = args;

        if (PlayerService.isPlayer(target)) {
            for (const type in collection) {
                const statuses = collection[type] as AttachedStatus[];

                // NOTE: At the moment there is no a way to check which
                // status was updated in the collection, for this case we trigger sync
                // for all statuses
                for (const status of statuses) {
                    await this.syncAllCardsByStatusMutated(ctx, status);
                }
            }
        }
    }

    async syncAllCardsByStatusMutated(
        ctx: GameContext,
        status: AttachedStatus = undefined,
    ): Promise<void> {
        if (this.statusService.isStatusEffect(status.name)) {
            const metadata = this.statusService.getMetadataByName(
                status.name,
            ) as StatusMetadata<StatusEffect>;

            // Ignore statuses:incoming
            if (metadata.status.direction == StatusDirection.Incoming) return;

            const effectsAffected = metadata.status.effects.map(
                (effect) => effect.name,
            );
            const player = this.playerService.get(ctx);

            for (const pile in player.value.combatState.cards) {
                const cards = player.value.combatState.cards[
                    pile
                ] as IExpeditionPlayerStateDeckCard[];

                for (const card of cards) {
                    const originalCard = await this.findById(card.cardId);
                    const originalDescription = originalCard.description;

                    const effects = originalCard.properties.effects.filter(
                        (effect) =>
                            // Effect is included in the affected effects
                            effectsAffected.includes(effect.effect) &&
                            // Effect is used in the description
                            originalDescription.includes(`{${effect.effect}}`),
                    );

                    if (effects.length) {
                        let finalDescription: string = originalDescription;
                        for (const effect of effects) {
                            const {
                                effect: effectName,
                                args: { value, ...args } = {},
                            } = effect;

                            let effectDTO: EffectDTO = {
                                ctx,
                                source: player,
                                args: {
                                    initialValue: value,
                                    currentValue: value,
                                    ...args,
                                },
                            };

                            effectDTO = await this.statusService.mutate({
                                ctx,
                                collectionOwner: player,
                                collection: player.value.combatState.statuses,
                                effect: effectName,
                                effectDTO: effectDTO,
                                preview: true,
                            });

                            finalDescription = originalDescription.replace(
                                `{${effectName}}`,
                                effectDTO.args.currentValue.toString(),
                            );

                            // Update description with new effect values
                            card.description = finalDescription;

                            // Format card description
                            card.description =
                                CardDescriptionFormatter.process(card);
                        }

                        await this.expeditionService.updateHandPiles({
                            clientId: ctx.client.id,
                            [pile]: cards,
                        });

                        // Update card message
                        ctx.client.emit(
                            'PutData',
                            StandardResponse.respond({
                                message_type: SWARMessageType.CardUpdated,
                                action: SWARAction.UpdateCardDescription,
                                data: {
                                    card,
                                    pile,
                                },
                            }),
                        );
                    }
                }
            }
        }
    }
}
