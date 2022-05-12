import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from './card.schema';
import { Model } from 'mongoose';
import { IExpeditionPlayerStateDeckCard } from '../../expedition/interfaces';

@Injectable()
export class CardService {
    constructor(
        @InjectModel(Card.name) private readonly card: Model<CardDocument>,
    ) {}

    async findAll(): Promise<CardDocument[]> {
        return this.card.find().lean();
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

    async findById(id: string): Promise<CardDocument> {
        return this.card.findById(id).lean();
    }
}
