import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Trinket } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { TrinketService } from './trinket.service';

@ApiBearerAuth()
@ApiTags('Trinkets')
@Controller('trinkets')
@UseGuards(new AuthGuard())
export class TrinketController {
    constructor(private readonly trinketService: TrinketService) {}

    @ApiOperation({
        summary: 'Get all trinkets',
    })
    @Get()
    async handleGetTrinkets(): Promise<Trinket[]> {
        return await this.trinketService.getTrinkets();
    }

    @ApiOperation({
        summary: 'Get a trinket by its id',
    })
    @Get(':id')
    async handleGetTrinket(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<Trinket> {
        return await this.trinketService.getTrinket(id);
    }
}
