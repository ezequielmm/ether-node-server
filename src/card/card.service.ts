import { Injectable } from '@nestjs/common';
import { cards, Prisma } from '@prisma/client';
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
    async getCard_V1(data: Prisma.cardsFindUniqueArgs): Promise<cards | null> {
        return await this.prisma.cards.findUnique(data);
    }

    /**
     * Get all cards
     * @version 1
     */
    async getCards_V1(): Promise<cards[]> {
        return await this.prisma.cards.findMany();
    }

    /**
     * Create a card
     * @version 1
     */
    async createCard_V1(data: CreateCardDto): Promise<cards> {
        return await this.prisma.cards.create({ data });
    }

    /**
     * Create a card
     * @version 1
     */
    async updateCard_V1(id: string, data: UpdateCardDto): Promise<cards> {
        return this.prisma.cards.update({ where: { id }, data });
    }
}
