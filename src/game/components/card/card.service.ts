import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { filter } from 'lodash';
import { Model } from 'mongoose';
import { CardPlayedAction } from 'src/game/action/cardPlayed.action';
import { EVENT_BEFORE_PLAYER_TURN_END } from 'src/game/constants';
import { ExpeditionService } from '../expedition/expedition.service';
import { GameContext } from '../interfaces';
import { CardKeywordEnum, CardRarityEnum, CardTypeEnum } from './card.enum';
import { Card, CardDocument } from './card.schema';
import { CardId, getCardIdField } from './card.type';

@Injectable()
export class CardService {
    private readonly logger = new Logger(CardService.name);
    constructor(
        @InjectModel(Card.name) private readonly card: Model<CardDocument>,
        private readonly cardPlayedAction: CardPlayedAction,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async findAll(): Promise<CardDocument[]> {
        return this.card.find().lean();
    }

    async findByType(card_type: CardTypeEnum): Promise<CardDocument[]> {
        return this.card.find({ card_type }).lean();
    }

    async findByRarity(rarity: CardRarityEnum): Promise<CardDocument[]> {
        return this.card.find({ rarity }).lean();
    }

    async findById(id: CardId): Promise<CardDocument> {
        const field = getCardIdField(id);
        return this.card.findOne({ [field]: id }).lean();
    }

    async findCardsById(cards: number[]): Promise<CardDocument[]> {
        return this.card.find({ cardId: { $in: cards } }).lean();
    }

    async getRandomCard(rarity: CardRarityEnum): Promise<CardDocument> {
        const cards = await this.findByRarity(rarity);
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        return randomCard;
    }

    async addCardToDeck(ctx: GameContext, cardId: number): Promise<void> {
        const newCard = await this.findById(cardId);
        const deck = ctx.expedition.playerState.cards;

        delete newCard._id;
        delete newCard.__v;

        deck.push({
            id: randomUUID(),
            isTemporary: false,
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

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_END)
    async onBeforePlayerTurnEnd(payload: { ctx: GameContext }) {
        const ctx = payload.ctx as GameContext;

        const fadeCards = filter(
            ctx.expedition.currentNode.data.player.cards.hand,
            {
                keywords: [CardKeywordEnum.Fade],
            },
        );

        if (fadeCards.length) {
            for (const card of fadeCards) {
                this.logger.debug(
                    `Auto playing fade card ${card.cardId}:${card.name}`,
                );
                await this.cardPlayedAction.handle({
                    client: ctx.client,
                    cardId: card.id,
                    selectedEnemyId: undefined,
                });
            }
        }
    }
}
