import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    Version,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { CardPool, CardpoolVisibilityEnum } from '@prisma/client';
import { CardPoolFiltersInterface } from 'src/interfaces/CardPoolFiltersInterface';
import { CardPoolService } from './cardpool.service';
import { CreateCardPoolDto } from './dto/createCardPool.dto';
import { UpdateCardPoolDto } from './dto/updateCardPool.dto';

@Controller('cardpools')
export class CardPoolController {
    constructor(private readonly service: CardPoolService) {}

    @Version('1')
    @ApiQuery({
        name: 'name',
        required: false,
        type: String,
        description: 'Name of the cardpool',
    })
    @ApiQuery({
        name: 'id',
        required: false,
        type: String,
        description: 'ID of the cardpool',
    })
    @ApiQuery({
        name: 'visibility',
        enum: CardpoolVisibilityEnum,
        description: 'Visibility of the cardpool',
    })
    @Get()
    async getCardPools_V1(
        @Query() filters: CardPoolFiltersInterface,
    ): Promise<CardPool[]> {
        return await this.service.getCardPools_V1(filters);
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
