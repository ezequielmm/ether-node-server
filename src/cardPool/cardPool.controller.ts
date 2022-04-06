import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CardPool, CardpoolVisibilityEnum } from '@prisma/client';
import { CardPoolService } from './cardPool.service';
import { CreateCardPoolDto } from './dto/createCardPool.dto';
import { GetCardPoolsDto } from './dto/getCardPools.dto';
import { UpdateCardPoolDto } from './dto/updateCardPool.dto';

@ApiBearerAuth()
@ApiTags('CardPools')
@Controller('cardpools')
export class CardPoolController {
    constructor(private readonly service: CardPoolService) {}

    @ApiOperation({
        summary: 'Get all cardpools',
    })
    @ApiQuery({
        name: 'name',
        required: false,
        type: String,
        description: 'Name of the cardpool',
    })
    @ApiQuery({
        name: 'visibility',
        enum: CardpoolVisibilityEnum,
        description: 'Visibility of the cardpool',
    })
    @ApiResponse({ status: 200, type: [GetCardPoolsDto] })
    @Get()
    async handleGetCardPools(
        @Query() payload: GetCardPoolsDto,
    ): Promise<CardPool[]> {
        return await this.service.getCardPools(payload);
    }

    @ApiOperation({
        summary: 'Get all cardpools',
    })
    @ApiResponse({ status: 200 })
    @Get(':id')
    async handleGetCardPool(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<CardPool> {
        return await this.service.getCardPoolById(id);
    }

    @ApiOperation({
        summary: 'Create a cardpool',
    })
    @ApiResponse({ status: 200 })
    @Post()
    async handleCreateCardPool(
        @Body() payload: CreateCardPoolDto,
    ): Promise<CardPool> {
        return await this.service.createCardPool(payload);
    }

    @ApiOperation({
        summary: 'Update a cardpool',
    })
    @ApiResponse({ status: 200 })
    @Patch(':id')
    async handleUpdateCardPool(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() payload: UpdateCardPoolDto,
    ): Promise<CardPool> {
        return await this.service.updateCardPool(id, payload);
    }
}
