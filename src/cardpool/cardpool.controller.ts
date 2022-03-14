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
import { CardPool } from '@prisma/client';
import { CardPoolService } from './cardpool.service';
import { CreateCardPoolDto } from './dto/createCardPool.dto';
import { UpdateCardPoolDto } from './dto/updateCardPool.dto';

@Controller('cardpools')
export class CardPoolController {
    constructor(private readonly service: CardPoolService) {}

    @Version('1')
    @Get()
    async getCardPools_V1(): Promise<CardPool[]> {
        return await this.service.getCardPools_V1();
    }

    @Version('1')
    @Get(':id')
    async getCardPool_V1(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<CardPool> {
        return await this.service.getCardPool_V1(id);
    }

    @Version('1')
    @Post()
    async createCardPool_V1(
        @Body() createCardPoolDto: CreateCardPoolDto,
    ): Promise<CardPool> {
        return this.service.createCardPool_V1(createCardPoolDto);
    }

    @Version('1')
    @Put(':id')
    async updateCardPool_V1(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateCardPoolDto: UpdateCardPoolDto,
    ): Promise<CardPool> {
        return this.service.updateCardPool_V1(id, updateCardPoolDto);
    }
}
