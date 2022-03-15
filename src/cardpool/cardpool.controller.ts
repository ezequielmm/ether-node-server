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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CardPool, CardpoolVisibilityEnum } from '@prisma/client';
import { CardPoolFiltersInterface } from 'src/interfaces/CardPoolFiltersInterface';
import { CardPoolService } from './cardpool.service';
import { CardPoolDto } from './dto/cardPool.dto';
import { CreateCardPoolDto } from './dto/createCardPool.dto';
import { UpdateCardPoolDto } from './dto/updateCardPool.dto';

@ApiTags('Cardpool')
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
    @ApiOperation({
        summary: 'Get all cardpools',
    })
    @ApiResponse({ status: 200, type: [CardPoolDto] })
    @Get()
    async getCardPools_V1(
        @Query() filters: CardPoolFiltersInterface,
    ): Promise<CardPool[]> {
        return await this.service.getCardPools_V1(filters);
    }

    @Version('1')
    @ApiOperation({
        summary: 'Get single cardpool',
    })
    @ApiResponse({ status: 200, type: CardPoolDto })
    @Get(':id')
    async getCardPool_V1(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<CardPool> {
        return await this.service.getCardPool_V1(id);
    }

    @Version('1')
    @ApiResponse({ status: 201, type: CardPoolDto })
    @ApiOperation({
        summary: 'Create a cardpool',
    })
    @Post()
    async createCardPool_V1(
        @Body() createCardPoolDto: CreateCardPoolDto,
    ): Promise<CardPool> {
        return this.service.createCardPool_V1(createCardPoolDto);
    }

    @Version('1')
    @ApiOperation({
        summary: 'Update an existing cardpool',
    })
    @Put(':id')
    async updateCardPool_V1(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateCardPoolDto: UpdateCardPoolDto,
    ): Promise<CardPool> {
        return this.service.updateCardPool_V1(id, updateCardPoolDto);
    }
}
