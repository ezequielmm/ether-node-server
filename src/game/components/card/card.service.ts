import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { filter } from 'lodash';
import { Model } from 'mongoose';
import { CardPlayedAction } from 'src/game/action/cardPlayed.action';
import { EVENT_BEFORE_PLAYER_TURN_END } from 'src/game/constants';
import { Context } from '../interfaces';
import { CardKeywordEnum, CardTypeEnum } from './card.enum';
import { Card, CardDocument } from './card.schema';
import { CardId } from './card.type';

@Injectable()
export class CardService {
    private readonly logger = new Logger(CardService.name);
    constructor(
        @InjectModel(Card.name) private readonly card: Model<CardDocument>,
        private readonly cardPlayedAction: CardPlayedAction,
    ) {}

    async findAll(): Promise<CardDocument[]> {
        return this.card.find().lean();
    }

    async findByType(card_type: CardTypeEnum): Promise<CardDocument[]> {
        return this.card.find({ card_type }).lean();
    }

    async findById(id: CardId): Promise<CardDocument> {
        return typeof id === 'string'
            ? this.card.findById(id).lean()
            : this.card.findOne({ cardId: id }).lean();
    }

    async findCardsById(cards: number[]): Promise<CardDocument[]> {
        return this.card.find({ cardId: { $in: cards } }).lean();
    }

    @OnEvent(EVENT_BEFORE_PLAYER_TURN_END)
    async onBeforePlayerTurnEnd(payload) {
        const ctx = payload.ctx as Context;

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
