import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from 'src/game/components/card/card.schema';
import { CardId, getCardIdField } from 'src/game/components/card/card.type';

/**
 * We use this simple card mock instead the CardService to avoid using
 * initializing all, and be able to use the CardDocument Model
 */
@Injectable()
export class CardServiceMock {
    constructor(
        @InjectModel(Card.name) private readonly card: Model<CardDocument>,
    ) {}
    async findById(id: CardId): Promise<CardDocument> {
        const field = getCardIdField(id);
        return this.card.findOne({ [field]: id }).lean();
    }
}
