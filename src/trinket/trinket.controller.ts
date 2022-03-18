import { Controller, Get, Param, ParseUUIDPipe, Version } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Trinket } from '@prisma/client';
import { TrinketService } from './trinket.service';

@Controller('trinkets')
@ApiTags('Trinket')
export class TrinketController {
    constructor(private readonly trinketService: TrinketService) {}

    @Version('1')
    @Get('/')
    async getTrinkets(): Promise<Trinket[]> {
        return await this.trinketService.getTrinkets();
    }

    @Version('1')
    @Get(':id')
    async getTrinket(@Param('id', ParseUUIDPipe) id: string): Promise<Trinket> {
        return await this.trinketService.getTrinket(id);
    }
}
