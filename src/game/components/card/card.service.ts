import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from 'kindagoose';
import { randomUUID } from 'crypto';
import { each, filter, find, map, uniq } from 'lodash';
import { FilterQuery } from 'mongoose';
import { CardPlayedAction } from 'src/game/action/cardPlayed.action';
import {
    EVENT_AFTER_DRAW_CARDS,
    EVENT_AFTER_STATUSES_UPDATE,
    EVENT_AFTER_STATUS_ATTACH,
} from 'src/game/constants';
import {
    AttachedStatus,
    StatusCollection,
    StatusDirection,
    StatusEffect,
    StatusMetadata,
    StatusTrigger,
} from 'src/game/status/interfaces';
import {
    AfterStatusAttachEvent,
    AfterStatusesUpdateEvent,
    StatusService,
} from 'src/game/status/status.service';
import { IExpeditionPlayerStateDeckCard } from '../expedition/expedition.interface';
import { ExpeditionService } from '../expedition/expedition.service';
import { ExpeditionEntity, GameContext } from '../interfaces';
import { PlayerService } from '../player/player.service';
import { CardKeywordEnum, CardRarityEnum, CardTypeEnum } from './card.enum';
import { Card } from './card.schema';
import { CardId, getCardIdField } from './card.type';
import { JsonEffect } from '../../effects/effects.interface';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from 'src/game/standardResponse/standardResponse';
import { CardDescriptionFormatter } from 'src/game/cardDescriptionFormatter/cardDescriptionFormatter';
import { getRandomNumber } from 'src/utils';
import { AfterDrawCardEvent } from 'src/game/action/drawCard.action';
import { MoveCardAction } from 'src/game/action/moveCard.action';
import { ReturnModelType } from '@typegoose/typegoose';
import { StatusGenerator } from 'src/game/status/statusGenerator';
import { EffectGenerator } from 'src/game/effects/EffectGenerator';

interface IOriginalDescription {
    cardId: number;
    originalDescription: string;
}

@Injectable()
export class CardService {
    private readonly logger = new Logger(CardService.name);
    constructor(
        @InjectModel(Card) private readonly card: ReturnModelType<typeof Card>,
        private readonly cardPlayedAction: CardPlayedAction,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        private readonly statusService: StatusService,
        private readonly playerService: PlayerService,
        private readonly moveCardAction: MoveCardAction,
    ) {}

    getDescriptionFromCard(card: IExpeditionPlayerStateDeckCard): string {
        return CardDescriptionFormatter.process(card);
    }

    async findAll(): Promise<Card[]> {
        return await this.card.find({ isActive: true }).lean();
    }

    async find(filter?: FilterQuery<Card>): Promise<Card[]> {
        return await this.card.find(filter).lean();
    }

    async findOne(filter: FilterQuery<Card>): Promise<Card> {
        return await this.card.findOne(filter).lean();
    }

    async getRandomCard(
        filter: FilterQuery<Card> = { isActive: true },
    ): Promise<Card> {
        const card = await this.card.aggregate<Card>([
            { $match: filter },
            { $sample: { size: 1 } },
        ]);

        return card[0];
    }

    async findByType(card_type: CardTypeEnum): Promise<Card[]> {
        return this.card
            .find({
                card_type,
                isActive: true,
                cardType: { $ne: CardTypeEnum.Status },
            })
            .lean();
    }

    async findByRarity(rarity: CardRarityEnum): Promise<Card[]> {
        return this.card
            .find({
                rarity,
                isActive: true,
                cardType: { $ne: CardTypeEnum.Status },
            })
            .lean();
    }

    async findById(id: CardId): Promise<Card> {
        const field = getCardIdField(id);
        return this.card.findOne({ [field]: id }).lean();
    }

    async findCardsById(cards: number[]): Promise<Card[]> {
        return this.card
            .find({ cardId: { $in: cards }, isActive: true })
            .lean();
    }

    async randomCards(limit: number, card_type: CardTypeEnum): Promise<Card[]> {
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
        const card = await this.findById(cardId);
        const deck = ctx.expedition.playerState.cards;

        const newCard: IExpeditionPlayerStateDeckCard = {
            id: randomUUID(),
            isTemporary: false,
            originalDescription: card.description,
            ...card,
        };

        newCard.description = CardDescriptionFormatter.process(
            newCard,
            card.description,
        );
        this.addStatusDescriptions(newCard);

        deck.push(newCard);

        this.logger.log(ctx.info, `Adding card ${cardId} to deck`);

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
        //let forceExhaust = false;
        for(const card of newHand){
            
            /*if (card.keywords.includes(CardKeywordEnum.Fade)) {
                // fade cards exhaust if unplayed during turn
                forceExhaust = true;
            } */         
            if(typeof card.triggerOnDrawn !== 'undefined'){
                
                card.keywords = [];
                /*for(const index of card.keywords){
                    if(index == CardKeywordEnum.Unplayable)
                } */ 
            } 
        }

        const cards = filter(newHand, {
            triggerOnDrawn: true,
        });

        if (cards.length > 0) {
            for (const card of cards) {
                this.logger.log(
                    ctx.info,
                    `Auto playing card ${card.cardId}:${card.name}`,
                );
                await this.cardPlayedAction.handle({
                    ctx,
                    cardId: card.id,
                    selectedEnemyId: undefined,
                    //forceExhaust,
                    newHand,
                });
            }
        }
    }

    // called explicitly instead of via event now
    // @OnEvent(EVENT_BEFORE_PLAYER_TURN_END)
    async onBeforePlayerTurnEnd(payload: { ctx: GameContext }) {
        const { ctx } = payload;
        let forceExhaust = false;
        const exhaustCardIds = [];

        console.log("onBeforePlayerTurnEnd-----------------------------------------------------------------------------------------------")
        for (const card of ctx.expedition.currentNode.data.player.cards.hand) {
            forceExhaust = false;
            if (card.keywords.includes(CardKeywordEnum.Fade) || card.keywords.includes(CardKeywordEnum.Exhaust)) {
                forceExhaust = true;
            }

            console.log(`Card --------------------`)
            console.log(card)

            if (typeof card.triggerAtEndOfTurn !== undefined) {

                console.log("TriggerAtEndOfTurn: true")

                card.properties = card.triggerAtEndOfTurn;
                card.keywords = [];
                
                await this.cardPlayedAction.handle({
                    ctx,
                    cardId: card.id,
                    selectedEnemyId: undefined,
                    forceExhaust,
                });
            } 

            if (forceExhaust) {
                // fade card wasn't exhausted due to trigger, so add to bulk list
                exhaustCardIds.push(card.id);
            }
        }

        // if we have a bulk exhaust list, use it now
        if (exhaustCardIds.length > 0) {
            await this.moveCardAction.handle({
                client: ctx.client,
                cardIds: exhaustCardIds,
                originPile: 'hand',
                targetPile: 'exhausted',
            });
        }
    }

    // @OnEvent(EVENT_BEFORE_PLAYER_TURN_END)
    // async onMoveFadeCard(payload: { ctx: GameContext }) {
    //     const { ctx } = payload;

    //     const cards = filter(
    //         ctx.expedition.currentNode.data.player.cards.hand,
    //         {
    //             keywords: [CardKeywordEnum.Fade],
    //         },
    //     );

    //     await this.moveCardAction.handle({
    //         client: ctx.client,
    //         cardIds: cards.map((card) => card.id),
    //         originPile: 'hand',
    //         targetPile: 'exhausted',
    //     });
    // }

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

    async getOriginalDescriptionsById(
        ctx: GameContext,
        cardIds: number[],
    ): Promise<IOriginalDescription[]> {
        const player = this.playerService.get(ctx);
        const cardIdsToFind = uniq(cardIds);

        // Extract original descriptions from cards in player deck, where possible, for speed
        const originalDescriptions: IOriginalDescription[] = filter(
            player.value.globalState.cards,
            (pCard) =>
                pCard.originalDescription &&
                cardIdsToFind.includes(pCard.cardId),
        ).map(
            (pCard) =>
                <IOriginalDescription>{
                    cardId: pCard.cardId,
                    originalDescription: pCard.originalDescription,
                },
        );

        // if we didn't get them all, retrieve the rest
        if (originalDescriptions.length !== cardIdsToFind.length) {
            const foundIds = map(originalDescriptions, (oDesc) => oDesc.cardId);

            const cardIdsToRetrieve = filter(
                cardIdsToFind,
                (cardId) => !foundIds.includes(cardId),
            );

            const cardsRetrieved = await this.findCardsById(cardIdsToRetrieve);
            for (const retrieved of cardsRetrieved) {
                // update cards that exist in the globalstate, for potential future speed
                each(player.value.globalState.cards, function (card) {
                    if (
                        !card.originalDescription &&
                        card.cardId == retrieved.cardId
                    ) {
                        card.originalDescription = retrieved.description;
                    }
                });

                // add original description for ids as retrieved
                originalDescriptions.push(<IOriginalDescription>{
                    cardId: retrieved.cardId,
                    originalDescription: retrieved.description,
                });
            }
        }

        return originalDescriptions;
    }

    async applyOriginalDescriptions(
        ctx: GameContext,
        cards: IExpeditionPlayerStateDeckCard[],
        preserveExisting = false,
    ): Promise<IExpeditionPlayerStateDeckCard[]> {
        const originalDescriptions = await this.getOriginalDescriptionsById(
            ctx,
            cards
                .filter(
                    (card) => !preserveExisting || !card.originalDescription,
                )
                .map<number>((card) => card.cardId),
        );

        for (const card of cards) {
            const oDesc = find(
                originalDescriptions,
                (originalDesc) => originalDesc.cardId == card.cardId,
            );

            if (oDesc && (!preserveExisting || !card.originalDescription)) {
                card.originalDescription = oDesc.originalDescription;
            }
            if (!card.originalDescription)
                card.originalDescription = card.description;
        }

        return cards;
    }

    async updateCardDescription(UpdateDescriptionDTO: {
        ctx: GameContext;
        card: IExpeditionPlayerStateDeckCard;
        target?: ExpeditionEntity;
        statusFilter?: AttachedStatus;
    }): Promise<string> {
        const { ctx, card, target, statusFilter } = UpdateDescriptionDTO;
        const result = await this.updateCardDescriptions({
            ctx,
            cards: [card],
            target: target,
            statusFilter: statusFilter,
        });
        return result[0].description;
    }

    async updateCardDescriptions(UpdateDescriptionsDTO: {
        ctx: GameContext;
        cards: IExpeditionPlayerStateDeckCard[];
        target?: ExpeditionEntity;
        statusFilter?: AttachedStatus;
    }): Promise<IExpeditionPlayerStateDeckCard[]> {
        const { ctx, cards, target, statusFilter } = UpdateDescriptionsDTO;

        // now, where appropriate, generate the mutated effects array for the card formatter
        const player = this.playerService.get(ctx);
        const playerStatuses = this.statusService.getStatuses(player);

        const statuses: {
            player: StatusCollection;
            target: StatusCollection;
        } = {
            player: playerStatuses,
            target:
                target && !PlayerService.isPlayer(target)
                    ? this.statusService.getStatuses(target)
                    : undefined,
        };

        const impactedEffects: string[] = [];
        if (statusFilter) {
            const metadata = this.statusService.getMetadataByName(
                statusFilter.name,
            ) as StatusMetadata<StatusEffect>;

            if (
                metadata.status.trigger !== StatusTrigger.Effect ||
                metadata.status.direction === StatusDirection.Incoming
            ) {
                return cards;
            }

            impactedEffects.push(
                ...map(metadata.status.effects, (e) => {
                    ctx.client.emit('CARD: pushing ' + e.name);
                    return e.name;
                }),
            );
        } else {
            // pre determine which effects are impacted by active relevant statuses
            const statusesActive: string[] = [];

            for (const entity in statuses) {
                const direction =
                    entity == 'player'
                        ? StatusDirection.Outgoing
                        : StatusDirection.Incoming;
                if (statuses[entity] !== 'undefined') {
                    for (const type in statuses[entity]) {
                        if (statuses[entity][type].length === 0) continue;
                        for (const status of statuses[entity][type]) {
                            // no need to check the same status twice
                            if (statusesActive.includes(status.name)) continue;

                            const metadata =
                                this.statusService.getMetadataByName(
                                    status.name,
                                );

                            if (
                                metadata.status.trigger !==
                                    StatusTrigger.Effect ||
                                metadata.status.direction != direction
                            )
                                continue;

                            statusesActive.push(status.name);
                            impactedEffects.push(
                                ...map(metadata.status.effects, (e) => e.name),
                            );
                        }
                    }
                }
            }
        }
        // ensure all cards that need them have original descriptions attached to start from
        await this.applyOriginalDescriptions(ctx, cards, true);

        for (const card of cards) {
            // if it doesn't require formatting, skip it
            if (
                !CardDescriptionFormatter.requiresFormatting(
                    card.originalDescription,
                )
            )
                continue;

            const mutatedEffects: JsonEffect[] = [];
            for (const effect of card.properties.effects) {
                if (
                    !CardDescriptionFormatter.impactedByEffectName(
                        card.originalDescription,
                        effect.effect,
                    )
                )
                    if (!impactedEffects.includes(effect.effect)) {
                        //continue;
                        ctx.client.emit(
                            'CARD FORMAT: skip on impacted effect via array : ' +
                                effect.effect +
                                ' vs ' +
                                impactedEffects,
                        );
                        // continue;
                    }

                const mutated = await this.statusService.mutate({
                    ctx,
                    collectionOwner: player,
                    collection: statuses.player,
                    effect: effect.effect,
                    effectDTO: {
                        ctx,
                        source: player,
                        target: target,
                        args: {
                            initialValue: effect.args?.value,
                            currentValue: effect.args?.value,
                            ...effect.args,
                        },
                    },
                    preview: true,
                });

                mutatedEffects.push({
                    effect: effect.effect,
                    args: mutated.args,
                });
            }

            const description = CardDescriptionFormatter.process(
                card,
                card.originalDescription,
                mutatedEffects,
            );
            this.addStatusDescriptions(card);
            //this.addEffectsDescriptions(card);

            if (description !== card.description) {
                card.description = description;
                ctx.client.emit(
                    'PutData',
                    StandardResponse.respond({
                        message_type: SWARMessageType.CardUpdated,
                        action: SWARAction.UpdateCardDescription,
                        data: { card },
                    }),
                );
            }
        }

        return cards;
    }

    addStatusDescriptions(card: IExpeditionPlayerStateDeckCard | Card) {
        card.properties.statuses.map((status) => {
            status.args.description = StatusGenerator.generateDescription(
                status.name,
                status.args.counter,
            );
            return status;
        });
    }

    addEffectsDescriptions(
        card: IExpeditionPlayerStateDeckCard | Card,
        mutatedEffects?: JsonEffect[],
    ) {
        card.properties.effects.map((effect) => {
            const mutant = find(
                mutatedEffects,
                (m) => m.effect === effect.effect,
            );

            effect.args.description = EffectGenerator.generateDescription(
                effect.effect,
                mutant?.args?.value ?? effect.args?.value ?? null,
            );
            return effect;
        });
    }

    async syncAllCardsByStatusMutated(
        ctx: GameContext,
        status: AttachedStatus = undefined,
    ): Promise<void> {
        const cards: IExpeditionPlayerStateDeckCard[] = [];
        const player = this.playerService.get(ctx);

        for (const pile in player.value.combatState.cards) {
            for (const card of player.value.combatState.cards[pile]) {
                cards.push(card);
            }
        }

        // update card descriptions directly on the card objects, referenced to hand piles
        await this.updateCardDescriptions({ ctx, cards, statusFilter: status });

        // then save hand piles
        await this.expeditionService.updateHandPiles({
            clientId: ctx.client.id,
        });

        //await this.syncAllCardsByStatusMutatedOld(ctx,status);
    }

    /*
    shuffleArray<IExpeditionPlayerStateDeckCard>(hand: IExpeditionPlayerStateDeckCard[]): IExpeditionPlayerStateDeckCard[] {
        const shuffledHand = [...hand];
    
        for (let i = shuffledHand.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledHand[i], shuffledHand[j]] = [shuffledHand[j], shuffledHand[i]];
        }
    
        return shuffledHand;
    }
    */

    // async syncAllCardsByStatusMutatedOld(
    //     ctx: GameContext,
    //     status: AttachedStatus = undefined,
    // ): Promise<void> {
    //     if (this.statusService.isStatusEffect(status.name)) {
    //         const metadata = this.statusService.getMetadataByName(
    //             status.name,
    //         ) as StatusMetadata<StatusEffect>;

    //         // Ignore statuses:incoming
    //         if (metadata.status.direction == StatusDirection.Incoming) return;

    //         const effectsAffected = metadata.status.effects.map(
    //             (effect) => effect.name,
    //         );
    //         const player = this.playerService.get(ctx);

    //         for (const pile in player.value.combatState.cards) {
    //             const cards = player.value.combatState.cards[
    //                 pile
    //             ] as IExpeditionPlayerStateDeckCard[];

    //             for (const card of cards) {
    //                 const originalCard = await this.findById(card.cardId);
    //                 const originalDescription = originalCard.description;

    //                 const effects = originalCard.properties.effects.filter(
    //                     (effect) =>
    //                         // Effect is included in the affected effects
    //                         effectsAffected.includes(effect.effect) &&
    //                         // Effect is used in the description
    //                         originalDescription.includes(`{${effect.effect}}`),
    //                 );

    //                 if (effects.length) {
    //                     let finalDescription: string = originalDescription;
    //                     for (const effect of effects) {
    //                         const {
    //                             effect: effectName,
    //                             args: { value, ...args } = {},
    //                         } = effect;

    //                         let effectDTO: EffectDTO = {
    //                             ctx,
    //                             source: player,
    //                             args: {
    //                                 initialValue: value,
    //                                 currentValue: value,
    //                                 ...args,
    //                             },
    //                         };

    //                         effectDTO = await this.statusService.mutate({
    //                             ctx,
    //                             collectionOwner: player,
    //                             collection: player.value.combatState.statuses,
    //                             effect: effectName,
    //                             effectDTO: effectDTO,
    //                             preview: true,
    //                         });

    //                         finalDescription = originalDescription.replace(
    //                             `{${effectName}}`,
    //                             effectDTO.args.currentValue.toString(),
    //                         );

    //                         // Update description with new effect values
    //                         card.description = finalDescription;

    //                         // Format card description
    //                         card.description =
    //                             CardDescriptionFormatter.process(card);
    //                     }

    //                     await this.expeditionService.updateHandPiles({
    //                         clientId: ctx.client.id,
    //                         [pile]: cards,
    //                     });

    //                     // Update card message
    //                     ctx.client.emit(
    //                         'PutData',
    //                         StandardResponse.respond({
    //                             message_type: SWARMessageType.CardUpdated,
    //                             action: SWARAction.UpdateCardDescription,
    //                             data: {
    //                                 card,
    //                                 pile,
    //                             },
    //                         }),
    //                     );
    //                 }
    //             }
    //         }
    //     }
    // }
}
