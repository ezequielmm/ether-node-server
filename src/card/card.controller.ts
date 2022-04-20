import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Card } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { CardService } from './card.service';
import { GetCardsDto } from './dto/getCards.dto';

@ApiBearerAuth()
@ApiTags('Cards')
@Controller('cards')
@UseGuards(new AuthGuard())
export class CardController {
    constructor(private readonly service: CardService) {}

    @ApiOperation({
        summary: 'Get all cards',
    })
    @ApiResponse({ status: 200, description: 'List of cards' })
    @Get()
    async handleGetCards(@Query() query: GetCardsDto): Promise<Card[]> {
        return await this.service.getCards(query);
    }
}
