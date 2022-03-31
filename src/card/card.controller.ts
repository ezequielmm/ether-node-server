import { Controller, Get, Query, Version } from '@nestjs/common';
import { Card } from '@prisma/client';
import { CardService } from './card.service';
import { FilterCards } from './dto/filterCards.dto';

@Controller('cards')
export class CardController {
    constructor(private readonly service: CardService) {}

    @Version('1')
    @Get()
    async getCards_V1(@Query() query: FilterCards): Promise<Card[]> {
        return await this.service.getCards_V1(query);
    }
}
