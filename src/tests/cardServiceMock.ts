import { Injectable } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { Card } from 'src/game/components/card/card.schema';
import { CardId, getCardIdField } from 'src/game/components/card/card.type';
import { ReturnModelType } from '@typegoose/typegoose';

/**
 * We use this simple card mock instead the CardService to avoid using
 * initializing all, and be able to use the CardDocument Model
 */
@Injectable()
export class CardServiceMock {
    constructor(
        @InjectModel(Card) private readonly card: ReturnModelType<typeof Card>,
    ) { }
    async findById(id: CardId): Promise<Card> {
        const field = getCardIdField(id);
        return this.card.findOne({ [field]: id }).lean();
    }
}
