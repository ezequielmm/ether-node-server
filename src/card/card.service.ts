import { Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { GetCardsDto } from './dto/getCards.dto';

@Injectable()
export class CardService {
    constructor(private readonly prisma: PrismaService) {}

    async getCards(payload: GetCardsDto): Promise<Card[]> {
        return await this.prisma.card.findMany({
            where: { ...payload },
            include: { cardpool: true },
        });
    }
}
