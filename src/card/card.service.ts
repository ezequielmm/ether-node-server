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
     * @param data
     * @returns card | null
     */
    async getCard_V1(id: string): Promise<Card | null> {
        const data: Prisma.CardFindUniqueArgs = {
            where: { id },
        };
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

    async checkIfNameExists(name: string): Promise<boolean> {
        const itemExists = await this.prisma.card.findUnique({
            where: { name },
        });
        return itemExists ? false : true;
    }

    async checkIfCodeExists(code: string): Promise<boolean> {
        const itemExists = await this.prisma.card.findUnique({
            where: { code },
        });
        return itemExists ? false : true;
    }
}
