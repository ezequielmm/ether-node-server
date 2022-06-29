import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from './card.schema';
import { Model } from 'mongoose';
import { CardTypeEnum } from './card.enum';
import { CardId } from './card.type';
import { IExpeditionPlayerStateDeckCard } from '../expedition/expedition.interface';

@Injectable()
export class CardService {
    constructor(
        @InjectModel(Card.name) private readonly card: Model<CardDocument>,
    ) {}

    async findAll(): Promise<CardDocument[]> {
        return this.card.find().lean();
    }

    async findByType(type: CardTypeEnum): Promise<CardDocument[]> {
        return this.card.find({ card_type: type }).lean();
    }

    removeHandCardsFromDrawPile(
        drawCards: IExpeditionPlayerStateDeckCard[],
        handCards: IExpeditionPlayerStateDeckCard[],
    ): IExpeditionPlayerStateDeckCard[] {
        return drawCards.filter((drawCard) => {
            return !handCards.some((handCard) => {
                return drawCard.id === handCard.id;
            });
        });
    }

    async findById(id: CardId): Promise<CardDocument> {
        return typeof id === 'string'
            ? this.card.findById(id).lean()
            : this.card.findOne({ cardId: id }).lean();
    }
}
