import { Controller, Get, Param, ParseUUIDPipe, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Trinket } from '@prisma/client';
import { TrinketService } from './trinket.service';

@ApiBearerAuth()
@ApiTags('Trinket')
@Controller('trinkets')
export class TrinketController {
    constructor(private readonly trinketService: TrinketService) {}

    @Version('1')
    @Get()
    async handleGetTrinkets(): Promise<Trinket[]> {
        return await this.trinketService.getTrinkets();
    }

    @Version('1')
    @Get(':id')
    async handleGetTrinket(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<Trinket> {
        return await this.trinketService.getTrinket(id);
    }
}
