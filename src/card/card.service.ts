import { Injectable } from '@nestjs/common';
import { Card, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateCardDto } from './dto/createCard.dto';
import { UpdateCardDto } from './dto/updateCard.dto';

@Injectable()
export class CardService {
    constructor(private prisma: PrismaService) {}

    /**
     * Get a single card
     * @version 1
     * @param cardsFindUniqueArgs
     * @returns card | null
     */
    async getCard_V1(data: Prisma.CardFindUniqueArgs): Promise<Card | null> {
        return await this.prisma.card.findUnique(data);
    }

    /**
     * Get all cards
     * @version 1
     */
    async getCards_V1(): Promise<Card[]> {
        return await this.prisma.card.findMany();
    }

    /**
     * Create a card
     * @version 1
     */
    async createCard_V1(data: CreateCardDto): Promise<Card> {
        return await this.prisma.card.create({ data });
    }

    /**
     * Create a card
     * @version 1
     */
    async updateCard_V1(id: string, data: UpdateCardDto): Promise<Card> {
        return this.prisma.card.update({ where: { id }, data });
    }
}
