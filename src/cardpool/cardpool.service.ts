import { Injectable } from '@nestjs/common';
import { CardPool, Prisma } from '@prisma/client';
import { CardPoolFiltersInterface } from 'src/interfaces/CardPoolFiltersInterface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CardPoolService {
    constructor(private prisma: PrismaService) {}

    /**
     * Get a single cardpool
     * @version 1
     * @param data
     * @returns cardpool | null
     */

    async getCardPool_V1(id: string): Promise<CardPool | null> {
        const data: Prisma.CardPoolFindUniqueArgs = {
            where: { id },
        };
        return await this.prisma.cardPool.findUnique(data);
    }

    /**
     * Get all cardpools
     * @version 1
     * returns CardPool[]
     */

    async getCardPools_V1(
        filters: CardPoolFiltersInterface,
    ): Promise<CardPool[]> {
        return await this.prisma.cardPool.findMany({
            where: {
                ...filters,
            },
        });
    }

    /**
     * Create a cardpool
     * @version 1
     * @returns Cardpool || null
     */

    async createCardPool_V1(data): Promise<CardPool> {
        return await this.prisma.cardPool.create({ data });
    }

    /**
     * Update a cardpool
     * @version 1
     * @returns CardPool | null
     */

    async updateCardPool_V1(id: string, data): Promise<CardPool> {
        return this.prisma.cardPool.update({ where: { id }, data });
    }

    /**
     * Check Duplicate Name
     * @param name
     * @returns true | false
     */

    async checkIfNameExists(name: string): Promise<boolean> {
        const itemExists = await this.prisma.cardPool.findUnique({
            where: { name },
        });
        return itemExists ? false : true;
    }
}
