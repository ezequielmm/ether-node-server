import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CardTypeEnum } from './card.enum';
import { Card, CardDocument } from './card.schema';
import { CardId } from './card.type';

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

    async findById(id: CardId): Promise<CardDocument> {
        return typeof id === 'string'
            ? this.card.findById(id).lean()
            : this.card.findOne({ cardId: id }).lean();
    }

    async findCardsById(cards: number[]): Promise<CardDocument[]> {
        return this.card.find({ cardId: { $in: cards } }).lean();
    }
}
