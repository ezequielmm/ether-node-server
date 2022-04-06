import { Injectable } from '@nestjs/common';
import { CardPool } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateCardPoolDto } from './dto/createCardPool.dto';
import { GetCardPoolsDto } from './dto/getCardPools.dto';
import { UpdateCardPoolDto } from './dto/updateCardPool.dto';

@Injectable()
export class CardPoolService {
    constructor(private readonly prisma: PrismaService) {}

    async getCardPoolById(id: string): Promise<CardPool> {
        return await this.prisma.cardPool.findUnique({ where: { id } });
    }

    async getCardPools(payload: GetCardPoolsDto): Promise<CardPool[]> {
        return await this.prisma.cardPool.findMany({ where: { ...payload } });
    }

    async createCardPool(data: CreateCardPoolDto): Promise<CardPool> {
        return await this.prisma.cardPool.create({ data });
    }

    async updateCardPool(
        id: string,
        data: UpdateCardPoolDto,
    ): Promise<CardPool> {
        return await this.prisma.cardPool.update({ where: { id }, data });
    }

    async checkIfNameExists(name: string): Promise<boolean> {
        const itemExists = await this.prisma.cardPool.findUnique({
            where: { name },
        });
        return itemExists ? false : true;
    }
}
