import { Controller, Get, Query, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Card } from '@prisma/client';
import { CardService } from './card.service';
import { FilterCards } from './dto/filterCards.dto';

@ApiTags('Cards')
@Controller('cards')
export class CardController {
    constructor(private readonly service: CardService) {}

    @Version('1')
    @ApiOperation({
        summary: 'Get all cards',
    })
    @Get('/')
    async getCards_V1(@Query() query: FilterCards): Promise<Card[]> {
        return await this.service.getCards_V1(query);
    }
}
