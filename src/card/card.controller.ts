import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Version,
} from '@nestjs/common';
import { cards, Prisma } from '@prisma/client';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/createCard.dto';
import { UpdateCardDto } from './dto/updateCard.dto';

@Controller('cards')
export class CardController {
    constructor(private readonly service: CardService) {}

    @Version('1')
    @Get('/')
    async getCards_V1(): Promise<cards[]> {
        return await this.service.getCards_V1();
    }

    @Version('1')
    @Get(':id')
    async getCard_V1(@Param('id', ParseUUIDPipe) id: string): Promise<cards> {
        const data: Prisma.cardsFindUniqueArgs = {
            where: { id },
        };
        return await this.service.getCard_V1(data);
    }

    @Version('1')
    @Post('/')
    async createCard_V1(@Body() createCardDto: CreateCardDto): Promise<cards> {
        return this.service.createCard_V1(createCardDto);
    }

    @Version('1')
    @Put('/:id')
    async updateCard_V1(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateCardDto: UpdateCardDto,
    ): Promise<cards> {
        return this.service.updateCard_V1(id, updateCardDto);
    }
}
