import { Injectable } from '@nestjs/common';
import { Card, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { FilterCards } from './dto/filterCards.dto';

@Injectable()
export class CardService {
    constructor(private prisma: PrismaService) {}

    /**
     * Get all cards
     * @version 1
     */
    async getCards_V1({
        cardpool_id,
        card_class,
    }: FilterCards): Promise<Card[]> {
        const data: Prisma.CardFindManyArgs = {
            where: {
                active: true,
            },
            include: {
                cardpool: true,
            },
        };
        if (cardpool_id) Object.assign(data.where, { OR: [{ cardpool_id }] });
        if (card_class) {
            Object.assign(data.where, { OR: [{ class: card_class }] });
        }
        if (cardpool_id && card_class) {
            Object.assign(data.where, {
                OR: [{ class: card_class }, { cardpool_id }],
            });
        }
        return await this.prisma.card.findMany(data);
    }
}
